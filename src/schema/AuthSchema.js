import { z } from "zod";

export class AuthSchema {
    static signup=z.object({
        username:z.string().min(1, "Username is required"),
        email:z.string().email("Invalid email"),
        password:z.string().min(8, "Password must be at least 8 characters long"),
    })

    static signin=z.object({
        email:z.string().email("Invalid email"),
        password:z.string().min(8, "Password must be at least 8 characters long"),
    })

    static refreshToken=z.object({
        email:z.string().email("Invalid email"),
        refreshToken:z.string().min(1, "Refresh token is required"),
    })

    static verifyOtp=z.object({
        email:z.string().email("Invalid email"),
        otp:z.string().length(6, "Invalid OTP"),
    })

    static forgotPassword=z.object({
        email:z.string().email("Invalid email"),
    })

    static resetPassword=z.object({
        email:z.string().email("Invalid email"),
        password:z.string().min(8, "Password must be at least 8 characters long"),
    })
 
}
