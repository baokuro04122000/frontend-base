
import { AUTH_USER_DATA_LS_ITEM } from "../constants/authentication";
import { FilterApiParams, CreateUserApiParams} from "../interfaces/api";
import { filtersToRequest, getAccessTokenFromLocalStorage } from "../utils";
import baseClient, { BASE_URL } from "./baseClient";
import { AdminApiFactory, AdminResetPassword, Configuration, CreateRoleRequest, UserIsActiveRequest, UserRoleUpdate } from "./openapi-generator";

const adminApiFactory = AdminApiFactory(undefined, BASE_URL, baseClient);

export const getUsers = <T>(filters?: FilterApiParams<T>) => {
  const { filter, offset, limit, sort_by, order_by } = filtersToRequest(filters);
  return adminApiFactory.usersGet(undefined, offset, limit, sort_by, order_by, {
    params: filter, 
  });
};


export const assignRole = (userRoleUpdate: UserRoleUpdate) => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.usersAssignRolePut(userRoleUpdate);
};

export const createUser = (user: CreateUserApiParams) => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.usersCreatePost(user)
}

export const createRole = (role: CreateRoleRequest) => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.usersCreateRolePost(role)
}

export const getRoleByID = (id: number) => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.authRolesIdGet(id)
}

export const getPermissionList = () => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.authPermissionsGet() 
}
export const getUserById = (id: number) => {
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.usersIdGet(id)
}
export const changeUserStatus = (userIsActiveRequest: UserIsActiveRequest) =>{
  const adminApiFactory = AdminApiFactory(new Configuration(
    {accessToken: getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}
  ), BASE_URL, baseClient);
  return adminApiFactory.usersIsActivePut(userIsActiveRequest)
}
export const adminResetPassword =(password: AdminResetPassword) =>{
  console.log(password)
  const adminApiFactory = AdminApiFactory(new Configuration({accessToken:getAccessTokenFromLocalStorage(AUTH_USER_DATA_LS_ITEM)}), BASE_URL, baseClient)
  return adminApiFactory.usersAdminResetPasswordPut(password);
}

