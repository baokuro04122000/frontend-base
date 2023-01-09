import { RoleDetail, UserCredentialResponse,  Response } from "../api/openapi-generator";

export interface AuthenticationSlice {
  authUser: null | UserCredentialResponse;
  emailUser: null | Response;
  resetPassword: null | Response;
  roles: RoleDetail[];
}

export interface JWTPayload {
  exp: number;
}
