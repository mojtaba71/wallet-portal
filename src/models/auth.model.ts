import type { MainResponse } from "./general.model";

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse extends MainResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenResponse extends MainResponse {
  accessToken: string;
  tokenType: string | null;
  expiresIn: number | null;
}