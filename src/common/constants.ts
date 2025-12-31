export const MESSAGES = {
    USER_CREATED_OTP_SENT: "User registered (unverified). OTP sent to email.",
  
    INVALID_CREDENTIALS: "Invalid credentials",
  
    OTP_EXPIRED: "OTP expired",
    OTP_INVALID: "Invalid OTP",
  
    EMAIL_ALREADY_REGISTERED: "Email already registered",
  
    RESEND_COOLDOWN: (s: number) => `Please wait ${s}s before resending OTP`,
  
    OTP_RESENT: "A new OTP has been sent to your email.",
    USER_NOT_FOUND: "User not found.",
    OTP_VERIFIED_LOGIN: "OTP verified successfully. Please login.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_RESET_INPUT_INVALID: "Email and new password are required",
   EMAIL_REQUIRED: "Email is required",
  OTP_SENT_FOR_PASSWORD_RESET: "OTP sent to email",
  OTP_EMAIL_SEND_FAILED: "Failed to send OTP email",
  SIGNUP_INPUT_INVALID: "Name, email and password are required",
  DOCTOR_ONBOARDING_NOT_STARTED: "Doctor onboarding not started",
  DOCTOR_PROFILE_UPDATE_FAILED: "Failed to update doctor profile",
  DOCTOR_BASIC_PROFILE_CREATED: "Doctor basic profile created successfully",
  USER_NOT_DOCTOR: "User is not a doctor",
  DOCTOR_PROFILE_NOT_FOUND: "Doctor profile not found",
  DOCTOR_PROFILE_FETCHED: "Doctor profile fetched successfully",
  DOCTOR_ONBOARDING_STARTED: "Doctor onboarding started",
  DOCTOR_ONBOARDING_RESUMED: "Doctor onboarding resumed",
 DOCTOR_BASIC_PROFILE_INCOMPLETE:
    "Basic profile must be completed before verification",
  DOCTOR_SUBMITTED_FOR_VERIFICATION: "Doctor submitted for verification",
  DOCTOR_PROFILE_UPDATED: "Doctor profile updated successfully",
  DOCTOR_PROFILE_UPDATE_INVALID: "Invalid doctor profile update request",
  DOCTOR_DOCUMENTS_INVALID: "Invalid document upload request",
  DOCTOR_DOCUMENTS_UPLOADED: "Documents uploaded successfully",
 DEFAULT_DOCTOR_AVATAR :
  "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff"

  };
  