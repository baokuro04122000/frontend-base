import { Table, Tag, } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import {UserDetailNew} from "../../api/openapi-generator";
import { useAppSelector, useAppDispatch } from "../../store";
import moment from 'moment'
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useMemo } from "react";
import { actionGetUsers } from "../../store/admin/action";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import { setUsers, setUsersPagination } from "../../store/admin/slice";
import { actionGetRoles } from "../../store/authentication/action";
import { setRoles } from "../../store/authentication/slice";
import { UserOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import {ADMIN_EDIT_USER_SUBPATH } from "../../constants/routes";
import { Link } from "react-router-dom";



const UsersTable = () => {
  const users = useAppSelector(({ admin }) => admin.users);
  const loading = useAppSelector(({ admin }) => admin.usersLoading);
  const pagination = useAppSelector(({ admin }) => admin.usersPagination);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actionGetUsers());
    dispatch(actionGetRoles());
    return () => {
      dispatch(setUsersPagination(undefined));
      dispatch(setUsers([]));
      dispatch(setRoles([]));
    };
  }, [dispatch]);
  let lastIndex = 0
  const updateIndex = () => {
    lastIndex++
    return lastIndex
  }
  const columns: ColumnsType<UserDetailNew> & { dataIndex?: keyof UserDetailNew }[] =
    useMemo(
      () => [

        {
          title: "Name",
          dataIndex: "full_name",
          key: "full_name",
          width: "10%",
          render: (text, record) => {

            return <span>
              <Link to={ADMIN_EDIT_USER_SUBPATH +"/" +record.id} ><UserOutlined style={{ fontSize: "15px" }} /></Link>
              <span style={{ padding: "10px" }}>{record.full_name}</span>
            </span>
          },
          // sorter: true,

        },
        {
          title: "Roles",
          key: `id${updateIndex()}`,
          dataIndex: "roles",
          width: "15%",
          render: (text, record) => (
            <span>
              {
                record.roles?.map((r, index) => (
                  <span key={index}>
                    {
                      index > 0 &&
                      <span className="ant-divider" style={{ paddingRight: "7px" }} />
                    }
                    <span>{r.name} </span>
                  </span>
                ))
              }
            </span>
          )
        },
        {
          title: "Email",
          dataIndex: "email",
          width: "10%",
        },
        {
          title: "Status",
          dataIndex: "status",
          width: "5%",
          render: (isActive) =>
            isActive ? (<Tag color="green">Active</Tag>) : (<Tag color="orange">Deactive</Tag>),
        },
        {
          title: "Last Login",
          dataIndex: "last_Login",
          key: "Last_login",
          width: "10%",
          render: (text) => moment(text).format('L - h:mm:ss a')
        },


      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
    []
    );

  const handlePagination = useCallback(
    (
      pagination: TablePaginationConfig,
      _filter: Record<string, FilterValue | null>,
      sorter: SorterResult<UserDetailNew> | SorterResult<UserDetailNew>[]
    ) => {
      // Allow sort only 1 column
      if (Array.isArray(sorter)) return;
      dispatch(actionGetUsers(pagination, undefined, sorter)
      );

    },
    [dispatch]
  );

  return (
    <div className={styles["user-list"]}>
      <Table
        className={styles["user-table"]}
        dataSource={users}
        loading={loading}
        columns={columns}
        rowKey={() => uuidv4()}
        pagination={pagination}
        onChange={handlePagination}
        scroll={{ x: 500 }}
        bordered

      />
    </div>
  );
};

export default UsersTable;
