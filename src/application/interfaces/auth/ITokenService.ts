export interface TokenPayload {
  id: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
}

export interface ITokenService {
  verifyAccessToken(token: string): TokenPayload;
}
