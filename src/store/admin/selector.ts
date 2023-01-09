import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectAdmin = (state: RootState) => state.admin;

export const selectUsers = createSelector(selectAdmin, (admin) => {
  return admin.users;
});
export const activeUsers = createSelector(selectAdmin,(admin)=>{
  return admin.userIsActive
})
