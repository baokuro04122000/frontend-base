import { createSelector } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { RootState } from "..";
import { JWTPayload } from "../../interfaces/authentication";

export const selectAuthentication = (state: RootState) => state.authentication;

export const selectIsAuth = createSelector(selectAuthentication, (auth) => {
  const token = auth.authUser?.access_token;
  if (!token) return false;
  const { exp } = jwtDecode<JWTPayload>(token);
  const now = new Date().getTime();
  if (now > exp * 1000) return false;
  return true;
});

export const selectPermissions = createSelector(
  selectAuthentication,
  (auth) => {
    const permissions = auth.authUser?.data?.roles
      ?.flatMap(({ permissions }) => permissions)
      .filter((permission) => !!permission);
    

    if (!permissions) return [];
    return permissions as string[];
  }
);

export const selectIsAdmin = createSelector(selectAuthentication, (auth) => {
  return !!auth.authUser?.data?.is_admin;
});

export const selectAccessToken = createSelector(selectAuthentication, (auth) => {
  return auth.authUser?.access_token
})
