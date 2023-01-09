import { TablePaginationConfig } from "antd";
import { PermissionNewDetail, RoleListByIdDetail, UserDetailNew, UserIsActiveRequest, UserRoleUpdate } from "../api/openapi-generator";
import { UsersQuery } from "./api";
export interface RoleDetailList {
  role_id: number;
  role_name:string;
  total_users: number;
  status: boolean
}

export interface AdminSlice {
  users: UserDetailNew[];
  usersLoading: boolean;
  usersPagination?: TablePaginationConfig;
  usersFilterEmail?: UsersQuery;
  usersFilterFullName?: UsersQuery;
  rolesFilterName?:string;
  roleList:RoleDetailList[];
  createRoleSuccess: boolean;
  roleByID?: RoleListByIdDetail;
  permissionList:PermissionNewDetail[]
  usersSorterFullName?: UsersQuery;
  userIsActive: UserIsActiveRequest | undefined;
  userInfor?: UserDetailNew;
  adminResetPassword: Response | null;
  userUpdate: UserRoleUpdate | null

}
