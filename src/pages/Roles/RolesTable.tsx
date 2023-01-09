import { Space, Table, Tag } from 'antd';
import { useMemo, useState, useCallback, useEffect } from 'react'
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.css'
import { v4 as uuidv4 } from "uuid";
import {Link} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store';

import { actionGetRoles } from '../../store/authentication/action';
import { setRoles } from '../../store/authentication/slice';
import { setCreateRoleSuccess } from '../../store/admin/slice'
import { RoleDetail } from '../../api/openapi-generator';

import {
  ADMIN_PATH,
  ADMIN_ROLE_LIST_SUBPATH,
} from '../../constants/routes'

const LINK_EDIT_ROLE = ADMIN_PATH+"/"+ADMIN_ROLE_LIST_SUBPATH
const RolesTable = () => {

  const roles = useAppSelector(({ authentication }) => authentication.roles);
  const createRoleSuccess = useAppSelector(({admin}) => admin.createRoleSuccess)
  const nameSearch = useAppSelector(({admin}) => admin.rolesFilterName)

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actionGetRoles());
    return () => {
      dispatch(setRoles([]));
    }
  }, [dispatch, createRoleSuccess])

  
  const rolesFilterName = useMemo(() => {
    const list = [...roles]
      if(nameSearch){
        if(nameSearch?.trim().length === 0){
          return list
        }
        return list.filter((role) => {
          if(role.name){
            return (role.name.toLowerCase().indexOf(nameSearch.toLowerCase()) >= 0)
          }
          return false
        })
      }
    return list
  }, [roles, nameSearch])
  const columns: ColumnsType<RoleDetail> & {dataIndex?: keyof RoleDetail}[] = 
  useMemo(()=> [
    {
      title: "Role",
      dataIndex: "name",
      render: (text, record) => {
        return <Link to={LINK_EDIT_ROLE+"/"+record.id}>
            {record.name}
          </Link>
      }
    },
    {
      title: "Total users",
      dataIndex: "total_users",
      render: (text, record) => {
        return <span>
            {""+record.total_users}
          </span>
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => 
        record.status ? (<Tag color="cyan">Active</Tag>) : (<Tag color="red">Inactive</Tag>)
    }
  ], [])
  return (
    <div>
      <Table
        className={styles["user-table"]}
        dataSource={rolesFilterName}
        rowKey={() => uuidv4()}
        columns={columns}
        pagination={false}
        scroll={{ x: 700 }}
      />
    </div>
  )
}

export default RolesTable