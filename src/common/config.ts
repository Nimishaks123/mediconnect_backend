import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediconnect",

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "change-me",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || process.env.JWT_EXPIRES_IN || "1h",

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "change-me-refresh",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  
  otpExpiryMin: Number(process.env.OTP_EXPIRY_MIN || 5),
  resendCooldownSec: Number(process.env.RESEND_COOLDOWN_SEC || 30),
  logLevel: process.env.LOG_LEVEL || "info",

  mailHost: process.env.SMTP_HOST || "",
  mailUser: process.env.SMTP_USER || "",
  mailPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.FROM_EMAIL || "",
  mailPort: Number(process.env.SMTP_PORT) || 587,

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    isProduction: process.env.NODE_ENV === "production",
    cloudinaryCloudName:process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || "http://localhost:5173",
  nodeEnv:process.env.NODE_ENV||"development"
    
};
