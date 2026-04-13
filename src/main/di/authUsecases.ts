// src/di/auth.usecases.ts

import {
  SignupUserUseCase,
  VerifyOtpUseCase,
  ResendOtpUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  SendForgotPasswordOtpUseCase,
  VerifyForgotPasswordOtpUseCase,
  ResetPasswordUseCase,
  LoginWithGoogleUseCase,
} from "@application/usecases/auth";

import {
  userRepository,
  doctorRepository,
  otpRepository,
} from "./repositories";

import {
  tokenService,
  oauthService,
  passwordHasher,
  randomGenerator,
  otpGenerator,
  eventBus,
} from "./services";

export const signupUserUseCase =
  new SignupUserUseCase(
    userRepository,
    doctorRepository,
    otpRepository,
    passwordHasher,
    otpGenerator,
    eventBus
  );

export const verifyOtpUseCase =
  new VerifyOtpUseCase(otpRepository, userRepository, doctorRepository, passwordHasher);

export const resendOtpUseCase =
  new ResendOtpUseCase(otpRepository, passwordHasher, otpGenerator, eventBus);

export const loginUseCase =
  new LoginUseCase(userRepository, doctorRepository, tokenService, passwordHasher);

export const refreshTokenUseCase =
  new RefreshTokenUseCase(tokenService);

export const sendForgotPasswordOtpUseCase =
  new SendForgotPasswordOtpUseCase(
    userRepository,
    otpRepository,
    passwordHasher,
    otpGenerator,
    eventBus
  );

export const verifyForgotPasswordOtpUseCase =
  new VerifyForgotPasswordOtpUseCase(otpRepository, passwordHasher);

export const resetPasswordUseCase =
  new ResetPasswordUseCase(userRepository, passwordHasher);

export const loginWithGoogleUseCase =
  new LoginWithGoogleUseCase(
    userRepository,
    doctorRepository,
    tokenService,
    oauthService,
    randomGenerator
  );
