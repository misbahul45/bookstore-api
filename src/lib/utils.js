import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

export const generateJwtToken = async (userId, existingRefreshToken = null) => {
    const accessToken = jwt.sign(
        { userId, iat: Math.floor(Date.now() / 1000) }, 
        process.env.JWT_ACCESS_SECRET, 
        { expiresIn: '30d' }
    );

    let refreshToken = existingRefreshToken; 

    if (!existingRefreshToken) {
        refreshToken = jwt.sign(
            { userId, iat: Math.floor(Date.now() / 1000), jti: userId }, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '30d' }
        );
    }

    return { accessToken, refreshToken };
};

export const setupCors = () => {
    return cors({
        origin:"*",
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
}


export const removeSensitiveData=(data)=>{
    if(Array.isArray(data)){
        return data.map((item)=>{
            const {password, otp, refreshToken, otpExpiresAt,  ...rest}=item;
            return rest;
        })
    }
    const {password, otp, refreshToken, otpExpiresAt,  ...rest}=data;
    return rest;
}
