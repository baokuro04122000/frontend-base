import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Response,
  RoleDetail,
  UserCredentialResponse,
} from "../../api/openapi-generator";
import { AuthenticationSlice } from "../../interfaces/authentication";

const initialState: AuthenticationSlice = {
  authUser: null,
  emailUser: null,
  resetPassword: null,
  roles: [],
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<UserCredentialResponse | null>) {
      state.authUser = action.payload;
    },
    setSendEmail(state, action: PayloadAction<Response | null>) {
      state.emailUser = action.payload;
    },
    setResetPassword(state, action: PayloadAction<Response | null>) {
      state.resetPassword = action.payload;
    },
    setRoles(state, action: PayloadAction<RoleDetail[]>) {
      state.roles = action.payload;
    },
  },
});

export const { setAuthUser, setRoles, setSendEmail, setResetPassword } = authenticationSlice.actions;

export default authenticationSlice.reducer;
