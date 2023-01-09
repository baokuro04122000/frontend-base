import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import {  PermissionDetail, PermissionNewDetail, RoleListByIdDetail, UserDetailNew, UserIsActiveRequest, UserRoleUpdate } from "../../api/openapi-generator";
import { AdminSlice, RoleDetailList } from "../../interfaces/admin";
import { UsersQuery } from "../../interfaces/api";

const initialState: AdminSlice = {
  users: [],
  usersLoading: true,
  usersPagination: undefined,
  usersFilterEmail: undefined,
  usersFilterFullName: undefined,
  rolesFilterName: undefined,
  roleList:[],
  createRoleSuccess: false,
  roleByID:undefined,
  permissionList:[],
  userIsActive: undefined,
  userInfor: undefined,
  adminResetPassword: null,
  userUpdate: null
  
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserDetailNew[]>) {
      state.users = action.payload;
    },
    setusersLoading(state, action: PayloadAction<boolean>) {
      state.usersLoading = action.payload;
    },
    setUserById(state, action: PayloadAction<UserDetailNew>){
      state.userInfor = action.payload
    },
    setUsersPagination(
      state,
      action: PayloadAction<TablePaginationConfig | undefined>
    ) {
      state.usersPagination = action.payload;
    },
    setUsersFilterEmail(
      state,
      { payload }: PayloadAction<UsersQuery | undefined>
    ) {
      state.usersFilterEmail = payload;
    },
    setUsersFilterFullName(
      state,
      { payload }: PayloadAction<UsersQuery | undefined>
    ) {
      state.usersFilterFullName = payload;
    },
    setRolesFilterName(
      state,
      { payload } : PayloadAction<string | undefined>
    ){
      state.rolesFilterName = payload
    },
    setRoleList(
      state,
      { payload } : PayloadAction<RoleDetailList[]>
    ){
      state.roleList = payload
    },
    setCreateRoleSuccess(
      state,
      {payload} : PayloadAction<boolean>
    ){
      state.createRoleSuccess = payload
    },
    setRoleByID(
      state,
      { payload } : PayloadAction<RoleListByIdDetail | undefined>
    ){
      state.roleByID = payload
    },
    setPermissionList(
      state,
      { payload } : PayloadAction<PermissionNewDetail[]>
    ){
      state.permissionList = payload
    },
    setUserStatus(
      state,
      {payload}: PayloadAction<UserIsActiveRequest>
    ){
      state.userIsActive = payload
    },
    setAdminResetPassword(state, action: PayloadAction<Response | null>) {
      state.adminResetPassword = action.payload;
    },
    setUserUpdate(state, action: PayloadAction<UserRoleUpdate |null>){
      state.userUpdate = action.payload
    }
  },
});

export const {
  setUsers,
  setusersLoading,
  setUserById,
  setUsersPagination,
  setUsersFilterEmail,
  setUsersFilterFullName,
  setRolesFilterName,
  setCreateRoleSuccess,
  setRoleByID,
  setPermissionList,
  setUserStatus,
  setAdminResetPassword,
  setUserUpdate
} = adminSlice.actions;

export default adminSlice.reducer;
