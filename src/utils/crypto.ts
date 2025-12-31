import bcrypt from "bcryptjs";

export const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const hashOtp = (otp: string) => {
  return bcrypt.hashSync(otp, 10);
};

export const verifyOtpHash = async (otp: string, hash: string) => {
  return bcrypt.compare(otp, hash);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
