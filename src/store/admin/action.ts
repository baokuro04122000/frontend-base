import { SorterResult, TablePaginationConfig } from "antd/lib/table/interface";
import { AppThunk } from "..";
import { 
  createUser,
  assignRole,
  getUsers,
  createRole,
  getRoleByID,
  getPermissionList,
  getUserById,
  changeUserStatus,
  adminResetPassword
} from "../../api/admin";

import {
  AdminResetPassword,
  CreateRoleRequest,
  RoleDetail,
  UserDetailNew,
  UserIsActiveRequest,
  UserRoleUpdate,
} from "../../api/openapi-generator";
import {
  UsersQuery,
  CreateUserApiParams
} from "../../interfaces/api";
import { responseToTablePagination } from "../../utils";
import { 
  setusersLoading,
  setUsers,
  setUsersPagination,
  setRoleByID,
  setPermissionList, 
  setUserById
} from "./slice";
import { AxiosError } from 'axios'
  

export const actionGetUsers = (
  _pagination?: TablePaginationConfig,
  _query?: UsersQuery[],
  sort?: SorterResult<UserDetailNew>
): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(setusersLoading(true));
      let query: UsersQuery[] | undefined = undefined;
      const queryEmail = getState().admin.usersFilterEmail;
      const queryFullName = getState().admin.usersFilterFullName;
      const querySortFullName = getState().admin.usersSorterFullName
      if (_query) {
        query = _query;
      } else if (queryEmail || queryFullName || querySortFullName) {
        query = [];
        if (queryEmail) query.push(queryEmail);
        if (queryFullName) query.push(queryFullName);
        if (querySortFullName) query.push(querySortFullName)
      }

      const pagination = _pagination || getState().admin.usersPagination;

      const { data } = await getUsers({ pagination, query, sort });

      const reponsePagination = responseToTablePagination(data);
      console.log(reponsePagination);
      

      dispatch(setUsers(data?.list || []));
      dispatch(setUsersPagination(reponsePagination));

    } catch (error) {
      console.error("CAN'T GET USERS");
    } finally {
      dispatch(setusersLoading(false));
    }
  };
};

export const actionAssignRole = (
  updateData: UserRoleUpdate 
): AppThunk<Promise<boolean>> => {
  return async (dispatch, getState) => {
    const { id, role_ids , user_name} = updateData;
    const users = getState().admin.userInfor;
    const roleList = getState().authentication.roles
    
    try {
      await assignRole({ id, role_ids, user_name });
      return true;
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data
    }
  };
};
export const actionGetUsersById = (
  id: number
): AppThunk<Promise<UserDetailNew>> => {
  return async (dispatch, getState) => {
    try{
      const {data} =  await getUserById(id)
      return dispatch(setUserById(data)).payload
      
    }catch(error){
      const err = error as AxiosError
      throw err.response?.data
    }finally{
      dispatch(setusersLoading(false))
    }
  }
}

export const actionCreateUser = (
  user: CreateUserApiParams
): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    try {
      dispatch(setusersLoading(true))
      await createUser(user)
      return true
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    } finally {
      dispatch(setusersLoading(false))
    }
  }
}

export const actionCreateRole = (
  role: CreateRoleRequest
): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    try {
      await createRole(role)
      return true
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionGetRoleByID = (
  id: number
): AppThunk<Promise<string | undefined>> => {
  return async (dispatch) => {
    try {
      const { data } = await getRoleByID(id)
      dispatch(setRoleByID(data))
      return data.name
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionGetPermissionList = (): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const {data} = await getPermissionList()
      dispatch(setPermissionList(data))
    } catch (error) {
      const err = error as AxiosError
        throw err.response?.data;
    }
  }
}


export const actionUpdateStatus = (
  userIsActive: UserIsActiveRequest
): AppThunk<Promise<boolean>> =>{
  return async (dispatch) => {
    try {
      const {data} = await changeUserStatus(userIsActive);
      console.log(data)
      return true;
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data
    }
  };
}
export const actionAdminResetPassword = (
  password: AdminResetPassword
): AppThunk<Promise<boolean>> =>{
  return async (dispatch) => {
    try {
      dispatch(setusersLoading(true))
      await adminResetPassword(password)
      return true
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    } finally {
      dispatch(setusersLoading(false))
    }
  }
}
