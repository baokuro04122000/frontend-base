import { AppThunk } from "..";
import { RoleDetail, UserCredentialResponse } from "../../api/openapi-generator";
import { AUTH_USER_DATA_LS_ITEM } from "../../constants/authentication";
import { setAuthUser, setResetPassword, setRoles, setSendEmail } from "./slice";

import {AxiosError} from 'axios'
import { resetPassword } from "../../api/authentication";
import { login, sendEmail, getRoles } from "../../api/authentication";

export const actionLogin = (
  email: string,
  password: string
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await login(email,password);
      dispatch(setAuthUser(data));
      localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  };
};

export const actionAutoLogin = (): AppThunk => {
  return (dispatch) => {
    const userData = localStorage.getItem(AUTH_USER_DATA_LS_ITEM);
    if (!userData) return;
    const parsedUserData: UserCredentialResponse = JSON.parse(userData);
    dispatch(setAuthUser(parsedUserData));
  };
};

export const actionLogout = (): AppThunk => {
  return async (dispatch) => {
    try {
      // TODO: await logout();
      localStorage.removeItem(AUTH_USER_DATA_LS_ITEM);
      dispatch(setAuthUser(null));
    } catch (error) {
      console.error("CAN'T LOGOUT");
    }
  };
};

export const actionGetRoles = (): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const listRoles = await getRoles();
      dispatch(setRoles(listRoles?.data.list || []));
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  };
};
export const actionSendEmail = (
  email: string
): AppThunk<Promise<void>> =>{
return async (dispatch)=>{
  try{
    const { data } = await sendEmail(email)
    console.log(data)
    dispatch(setSendEmail(data));
    localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data));
  }catch(error){
    const err = error as AxiosError
      throw err.response?.data;
  }
}
}

export const actionResetPassword = (
  password: string,
  jt: string

): AppThunk<Promise<void>> =>{
return async (dispatch)=>{
  try {
    const { data } = await resetPassword(password, jt)
    dispatch(setResetPassword(data));
  } catch (error) {
    const err = error as AxiosError
    throw err.response?.data;
  }
}
}

