import { AUTH_USER_DATA_LS_ITEM } from "../constants/authentication";
import { getAccessTokenFromLocalStorage } from "../utils";
import baseClient, { BASE_URL } from "./baseClient";
import { AuthApiFactory, Configuration } from "./openapi-generator";

const authApiFactory = AuthApiFactory(undefined, BASE_URL, baseClient);

export const login = (email: string, password: string) => {
  return authApiFactory.authLoginPost({ email, password });
};


export const logout = () => {
  return authApiFactory.authLogoutPost();
};
export const sendEmail = (email: string)=>{
  return authApiFactory.authForgotPasswordPost({email})

}
export const resetPassword =(password: string, token: string) =>{
  const authApiFactory2 = AuthApiFactory(new Configuration({accessToken:token}), BASE_URL, baseClient);
  return authApiFactory2.usersResetPasswordPut({password});
}

export const getRoles = () => {
  const authApiFactory = AuthApiFactory(new Configuration({accessToken:getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}), BASE_URL, baseClient)
  return authApiFactory.authRolesGet()
};
