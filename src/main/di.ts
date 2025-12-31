// ============================================================================
//  REPOSITORIES (Infrastructure Layer)
// ============================================================================
import { UserRepository } from "@infrastructure/persistence/UserRepository";
import { PatientRepository } from "@infrastructure/persistence/PatientRepository";
import { DoctorRepository } from "@infrastructure/persistence/DoctorRepository";
import { AdminRepository } from "@infrastructure/persistence/AdminRepository";
import { OtpRepository } from "@infrastructure/persistence/OtpRepository";
import { MongoAppointmentRepository } 
  from "@infrastructure/persistence/MongoAppointmentRepository";
import { MongoDoctorAvailabilityRepository } 
  from "@infrastructure/persistence/MongoDoctorAvailabilityRepository";

// ============================================================================
//  SERVICES (Application + Infrastructure)
// ============================================================================
import { TokenService } from "@application/services/TokenService";
import { NodemailerMailer } from "@infrastructure/mailer/NodemailerMailer";
import { CloudinaryFileStorageService } 
  from "@infrastructure/services/CloudinaryFileStorageService";
import { GoogleOAuthService } from "@infrastructure/services/GoogleOAuthService";

import { IOAuthService } from "@application/interfaces/services/IOAuthService";
import { IFileStorageService } from "@application/interfaces/services/IFileStorageService";

import { config } from "@common/config";

// ============================================================================
//  AUTH USE CASE INTERFACES
// ============================================================================
import {
  ISignupUserUseCase,
  IVerifyOtpUseCase,
  IResendOtpUseCase,
  ILoginUseCase,
  IRefreshTokenUseCase,
  ISendForgotPasswordOtpUseCase,
  IVerifyForgotPasswordOtpUseCase,
  IResetPasswordUseCase,
  ILoginWithGoogleUseCase,
} from "@application/interfaces/auth";

// ============================================================================
//  ADMIN USE CASE INTERFACES
// ============================================================================
import {
  IGetPendingDoctorsUseCase,
  IApproveDoctorUseCase,
  IRejectDoctorUseCase,
  IBlockUnblockUserUseCase,
  IGetAllUsersUseCase,
  IAdminLoginUseCase,
} from "@application/interfaces/admin";

// ============================================================================
//  DOCTOR USE CASE INTERFACES
// ============================================================================
import {
  IStartDoctorOnboardingUseCase,
  ICreateDoctorProfileUseCase,
  IUpdateDoctorProfileUseCase,
  IUploadDoctorDocumentsUseCase,
  ISubmitForVerificationUseCase,
  IGetDoctorProfileUseCase,
} from "@application/interfaces/doctor";

// ============================================================================
//  USE CASE IMPLEMENTATIONS
// ============================================================================
import { SignupUserUseCase } from "@application/usecases/auth/SignupUserUseCase";
import { VerifyOtpUseCase } from "@application/usecases/auth/VerifyOtpUseCase";
import { ResendOtpUseCase } from "@application/usecases/auth/ResendOtpUseCase";
import { LoginUseCase } from "@application/usecases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "@application/usecases/auth/RefreshTokenUseCase";
import { SendForgotPasswordOtpUseCase } from "@application/usecases/auth/SendForgotPasswordOtpUseCase";
import { VerifyForgotPasswordOtpUseCase } from "@application/usecases/auth/VerifyForgotPasswordOtpUseCase";
import { ResetPasswordUseCase } from "@application/usecases/auth/ResetPasswordUseCase";
import { LoginWithGoogleUseCase } from "@application/usecases/auth/LoginWithGoogleUseCase";

import { AdminLoginUseCase } from "@application/usecases/admin/AdminLoginUseCase";
import { GetPendingDoctorsUseCase } from "@application/usecases/admin/GetPendingDoctorsUseCase";
import { ApproveDoctorUseCase } from "@application/usecases/admin/ApproveDoctorUseCase";
import { RejectDoctorUseCase } from "@application/usecases/admin/RejectDoctorUseCase";
import { BlockUnblockUserUseCase } from "@application/usecases/admin/BlockUnblockUserUseCase";
import { GetAllUsersUseCase } from "@application/usecases/admin/GetAllUsersUseCase";

import { StartDoctorOnboardingUseCase } from "@application/usecases/doctor/StartDoctorOnboardingUseCase";
import { CreateDoctorProfileUseCase } from "@application/usecases/doctor/CreateDoctorProfileUseCase";
import { UpdateDoctorProfileUseCase } from "@application/usecases/doctor/UpdateDoctorProfileUseCase";
import { UploadDoctorDocumentsUseCase } from "@application/usecases/doctor/UploadDoctorDocumentsUseCase";
import { SubmitForVerificationUseCase } from "@application/usecases/doctor/SubmitForVerificationUseCase";
import { GetDoctorProfileUseCase } from "@application/usecases/doctor/GetDoctorProfileUseCase";

import { BookAppointmentUseCase } 
  from "@application/usecases/appointments/BookAppointmentUseCase";
import { ConfirmAppointmentUseCase } 
  from "@application/usecases/appointments/ConfirmAppointmentUseCase";
import { CancelAppointmentUseCase } 
  from "@application/usecases/appointments/CancelAppointmentUseCase";
import { CompleteAppointmentUseCase } 
  from "@application/usecases/appointments/CompleteAppointmentUseCase";
import { GetDoctorAvailabilityUseCase } 
  from "@application/usecases/appointments/GetDoctorAvailabilityUseCase";
import { CreateDoctorAvailabilityUseCase } 
  from "@application/usecases/appointments/CreateDoctorAvailabilityUseCase";


// ============================================================================
//  CONTROLLERS
// ============================================================================
import { AuthController } from "@presentation/controllers/AuthController";
import { DoctorController } from "@presentation/controllers/DoctorController";
import { AdminController } from "@presentation/controllers/AdminController";
import { AppointmentController } 
  from "@presentation/controllers/AppointmentController";

// ============================================================================
//  REPOSITORY INSTANCES
// ============================================================================
const userRepository = new UserRepository();
const doctorRepository = new DoctorRepository();
const adminRepository = new AdminRepository();
const otpRepository = new OtpRepository();
const appointmentRepository = new MongoAppointmentRepository();
const doctorAvailabilityRepository =
  new MongoDoctorAvailabilityRepository();

// ============================================================================
//  SERVICE INSTANCES
// ============================================================================
const tokenService = new TokenService(
  config.accessTokenSecret,
  config.accessTokenExpiry,
  config.refreshTokenSecret,
  config.refreshTokenExpiry
);

const mailer = new NodemailerMailer(
  config.mailHost,
  config.mailPort,
  config.mailUser,
  config.mailPass,
  config.mailFrom
);

// PORT → ADAPTER
export const oauthService: IOAuthService = new GoogleOAuthService();

const fileStorageService: IFileStorageService =
  new CloudinaryFileStorageService();

// ============================================================================
//  AUTH USE CASES
// ============================================================================
const signupUserUseCase: ISignupUserUseCase =
  new SignupUserUseCase(userRepository, otpRepository, mailer);

const verifyOtpUseCase: IVerifyOtpUseCase =
  new VerifyOtpUseCase(otpRepository, userRepository);

const resendOtpUseCase: IResendOtpUseCase =
  new ResendOtpUseCase(otpRepository, mailer);

const loginUseCase: ILoginUseCase =
  new LoginUseCase(userRepository, tokenService);

const refreshTokenUseCase: IRefreshTokenUseCase =
  new RefreshTokenUseCase(tokenService);

const sendForgotPasswordOtpUseCase: ISendForgotPasswordOtpUseCase =
  new SendForgotPasswordOtpUseCase(userRepository, otpRepository, mailer);

const verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordOtpUseCase =
  new VerifyForgotPasswordOtpUseCase(otpRepository);

const resetPasswordUseCase: IResetPasswordUseCase =
  new ResetPasswordUseCase(userRepository);

const loginWithGoogleUseCase: ILoginWithGoogleUseCase =
  new LoginWithGoogleUseCase(userRepository, tokenService, oauthService);

// ============================================================================
//  DOCTOR USE CASES
// ============================================================================
const startDoctorOnboardingUseCase: IStartDoctorOnboardingUseCase =
  new StartDoctorOnboardingUseCase(doctorRepository, userRepository);

const createDoctorProfileUseCase: ICreateDoctorProfileUseCase =
  new CreateDoctorProfileUseCase(doctorRepository);

const updateDoctorProfileUseCase: IUpdateDoctorProfileUseCase =
  new UpdateDoctorProfileUseCase(doctorRepository);
import { GetVerifiedDoctorsUseCase } from "@application/usecases/doctor/GetVerifiedDoctorsUseCase";

const getVerifiedDoctorsUseCase =
  new GetVerifiedDoctorsUseCase(doctorRepository,userRepository);

// const uploadDoctorDocumentsUseCase: IUploadDoctorDocumentsUseCase =
//   new UploadDoctorDocumentsUseCase(doctorRepository, fileStorageService);
const uploadDoctorDocumentsUseCase: IUploadDoctorDocumentsUseCase =
  new UploadDoctorDocumentsUseCase(
    doctorRepository,
    fileStorageService
  );


const submitForVerificationUseCase: ISubmitForVerificationUseCase =
  new SubmitForVerificationUseCase(doctorRepository);

const getDoctorProfileUseCase: IGetDoctorProfileUseCase =
  new GetDoctorProfileUseCase(userRepository, doctorRepository);

// ============================================================================
//  ADMIN USE CASES
// ============================================================================
const adminLoginUseCase: IAdminLoginUseCase =
  new AdminLoginUseCase(adminRepository, tokenService);

const getPendingDoctorsUseCase: IGetPendingDoctorsUseCase =
  new GetPendingDoctorsUseCase(doctorRepository, userRepository);

const approveDoctorUseCase: IApproveDoctorUseCase =
  new ApproveDoctorUseCase(doctorRepository,userRepository,mailer);

const rejectDoctorUseCase: IRejectDoctorUseCase =
  new RejectDoctorUseCase(doctorRepository,userRepository,mailer);

const blockUnblockUserUseCase: IBlockUnblockUserUseCase =
  new BlockUnblockUserUseCase(userRepository);

const getAllUsersUseCase: IGetAllUsersUseCase =
  new GetAllUsersUseCase(userRepository);

  const bookAppointmentUseCase =
  new BookAppointmentUseCase(
    doctorAvailabilityRepository,
    appointmentRepository
  );

const confirmAppointmentUseCase =
  new ConfirmAppointmentUseCase(
    appointmentRepository
  );

const cancelAppointmentUseCase =
  new CancelAppointmentUseCase(
    appointmentRepository
  );

const completeAppointmentUseCase =
  new CompleteAppointmentUseCase(
    appointmentRepository
  );

const getDoctorAvailabilityUseCase =
  new GetDoctorAvailabilityUseCase(
    doctorAvailabilityRepository
  );

const createDoctorAvailabilityUseCase =
  new CreateDoctorAvailabilityUseCase(
    doctorAvailabilityRepository
  );


// ============================================================================
//  CONTROLLERS
// ============================================================================
export const authController = new AuthController(
  signupUserUseCase,
  verifyOtpUseCase,
  resendOtpUseCase,
  loginUseCase,
  refreshTokenUseCase,
  sendForgotPasswordOtpUseCase,
  verifyForgotPasswordOtpUseCase,
  resetPasswordUseCase,
  loginWithGoogleUseCase
);

export const doctorController = new DoctorController(
  startDoctorOnboardingUseCase,
  createDoctorProfileUseCase,
  updateDoctorProfileUseCase,
  uploadDoctorDocumentsUseCase,
  submitForVerificationUseCase,
  getDoctorProfileUseCase,
   getVerifiedDoctorsUseCase 
);

export const adminController = new AdminController(
  adminLoginUseCase,
  getPendingDoctorsUseCase,
  approveDoctorUseCase,
  rejectDoctorUseCase,
  blockUnblockUserUseCase,
  getAllUsersUseCase
);
export const appointmentController =
  new AppointmentController(
    bookAppointmentUseCase,
    getDoctorAvailabilityUseCase,     
    createDoctorAvailabilityUseCase,   
    confirmAppointmentUseCase,        
    cancelAppointmentUseCase,         
    completeAppointmentUseCase         
  );