import { users } from "../db/schema.js";
import { AppError } from "../middleware/errorHandler.js";
import { hashText, compareHashed } from "../lib/bcrypt.js";
import { generateJwtToken } from "../lib/utils.js";
import { validate } from "../lib/zod.js";
import { AuthSchema } from "../schema/AuthSchema.js";
import db from "../db/index.js";
import 'dotenv/config';
import { v4 as uuid } from 'uuid';
export class AuthController {
  static async signup(data) {
    try {
      const dataUser = await validate(data, AuthSchema.signup);
      dataUser.password = hashText(dataUser.password);
      const isUser = await db.select().from(users).where({
        email: dataUser.email,
      });

      if (isUser.length > 0) {
        throw new AppError("User already exists", 409);
      }
      const generateNameEmail= dataUser.email.split('@')[0];
      dataUser.avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${generateNameEmail}`;

      const otp= Math.floor(100000 + Math.random() * 900000).toString();
      dataUser.otp = hashText(otp.toString());

      // Pastikan dataUser.id sudah ada, jika belum, Anda perlu meng-generate ID atau menunggu hasil insert
      dataUser.id = uuid();
    
      await db.insert(users).values({
        ...dataUser,
        otpExpiredAt: new Date(Date.now() +  10* 60 * 1000), // OTP expired in 10 minutes
      });
      return {
        message: "Successfully signed up",
        status: 201,
        data:{
          otp
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(data) {
    try {
     
      data= await validate(data, AuthSchema.refreshToken);
      // Ambil user berdasarkan email atau id, tergantung bagaimana Anda mengidentifikasi refresh token
      const user = await db.select().from(users).where({ email:data.email }).limit(1);

      if (user.length === 0) {
        throw new AppError("User not found", 401);
      }

      // Bandingkan refreshToken yang dikirim dengan yang tersimpan (hash)
      const isMatch = compareHashed(data.refreshToken, user[0].refreshToken);
      if (!isMatch) {
        throw new AppError("Invalid refresh token", 401);
      }

      const { accessToken, refreshToken: newRawRefreshToken } = await generateJwtToken(user[0].id);
      const newHashedRefreshToken = hashText(newRawRefreshToken);

      await db.update(users).set({ refreshToken: newHashedRefreshToken }).where({ id: user[0].id });

      return {
        message: "Successfully refreshed token",
        status: 200,
        data: {
          accessToken,
          refreshToken: newRawRefreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async signin(data) {
    try {
      data= await validate(data, AuthSchema.signin);
      const user = await db.select().from(users).where({ email: data.email }).limit(1);
      if (user.length === 0) {
        throw new AppError("User not found", 401);
      }

      if(!user[0].isActive){
        throw new AppError("User not active", 401);
      }

      if(!user[0].isVerified){
        throw new AppError("User not verified", 401);
      }

      if(user[0].otp){
        throw new AppError("Please verify your OTP first", 401);
      }

      const isMatch = compareHashed(data.password, user[0].password);
      if (!isMatch) {
        throw new AppError("Invalid password", 401);
      }

      const { accessToken, refreshToken: rawRefreshToken } = await generateJwtToken(user[0].id);
      const hashedRefreshToken = hashText(rawRefreshToken);
      await db.update(users).set({ refreshToken: hashedRefreshToken }).where({ id: user[0].id });
      return {
        message: "Successfully signed in",
        status: 200,
        data: {
          accessToken,
          refreshToken: rawRefreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async verifyOtp({ email, otp }) {
    try{
      const data= await validate({ email, otp }, AuthSchema.verifyOtp);
      const user=await db.select().from(users).where({
        email:data.email
      });
      if(user.length==0){
        throw new AppError("User not found", 404);
      }
      const isExpired=new Date(user[0].updatedAt.getTime()+10 * 60 * 1000) > new Date();
      if(isExpired){
        throw new AppError("OTP expired", 401);
      } 
      const isMatchOTP=compareHashed(otp.toString(), user[0].otp);
      if(!isMatchOTP){
        throw new AppError("Invalid OTP", 401);
      }

      await db.update(users).set({
        isVerified:true,
        isActive:true,
        otp:null
      }).where({ id:user[0].id });

      return{
        message:"Successfully verified OTP",
        status:200,
      }
    }catch(error){
      throw error;
    }
  }

  static async forgotPassword(data){
    try{
      data= await validate(data, AuthSchema.forgotPassword);
      const user=await db.select().from(users).where({
        email:data.email
      });
      if(user.length==0){
        throw new AppError("User not found", 404);
      }
      const otp= Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp=hashText(otp.toString());
      await db.update(users).set({
        otp:hashedOtp,
        otpExpiredAt:new Date(Date.now() + 10*60*1000)
      }).where({ id:user[0].id });

      return{
        message:"Successfully sent OTP",
        status:200,
        data:{
          otp
        }
      }
    }catch(error){
      throw error;
    }
  }
  static async resetPassword(data){
    try{
      data= await validate(data, AuthSchema.resetPassword);
      const user=await db.select().from(users).where({
        email:data.email
      });
      if(user.length==0){
        throw new AppError("User not found", 404);
      }

      if(user[0].otp){
        throw new AppError("Please verify your OTP first", 401);
      }
      const isExpired= user[0].updatedAt-10 < new Date();
      if(isExpired){
        throw new AppError("OTP expired", 401);
      } 

      await db.update(users).set({
        password:hashText(data.password),
        otp:null,
        otpExpiredAt:null
      }).where({ id:user[0].id });

      return{
        message:"Successfully reset password",
        status:200,
      }
    }catch(error){
      throw error;
    }
  }

}
