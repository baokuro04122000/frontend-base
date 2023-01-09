import { Button, Input } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FilterWrapper from "../../components/FilterWrapper";
import { UsersQuery } from "../../interfaces/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { actionGetUsers } from "../../store/admin/action";
import {
  setUsersFilterEmail,
  setUsersFilterFullName,
} from "../../store/admin/slice";
import {ADMIN_CREATE_USER_SUBPATH} from '../../constants/routes'
import styles from "./index.module.css";


const UsersFilter = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const pagination = useAppSelector(({ admin }) => admin.usersPagination);
  const dispatch = useAppDispatch();

  const emailQuery: UsersQuery | undefined = useMemo(
    () =>
      email === ""
        ? undefined
        : {
            key: "email",
            operator: "like",
            value: email,
          },
    [email]
  );

  const fullNameQuery: UsersQuery | undefined = useMemo(
    () =>
      fullName === ""
        ? undefined
        : {
            key: "full_name",
            operator: "like",
            value: fullName,
          },
    [fullName]
  );

  const query = useMemo(
    () =>
      [emailQuery, fullNameQuery].filter(
        (item) => item !== undefined
      ) as UsersQuery[],
    [emailQuery, fullNameQuery]
  );

  const handleSubmit = useCallback(() => {
    dispatch(setUsersFilterFullName(fullNameQuery));
    console.log(fullNameQuery)
    dispatch(setUsersFilterEmail(emailQuery));
    console.log(emailQuery)
    // When search, set pagination back to page 1
    dispatch(actionGetUsers({ ...pagination, current: undefined }, query));
    
  }, [dispatch, emailQuery, fullNameQuery, pagination, query]);

  useEffect(() => {
    return () => {
      dispatch(setUsersFilterFullName(undefined));
      dispatch(setUsersFilterEmail(undefined));
    };
  }, [dispatch]);

  return (
    <div className={styles["filter-form"]}>
        <FilterWrapper label="User Filter">
            <>
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1 }}
                />
                <Input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ flex: 1 }}
                />
                <Button type="primary" onClick={handleSubmit}>
                    Search
                </Button>

            </>
        </FilterWrapper>
        <Button type="primary" style={{margin:"20px 10px"}}>
          <Link to={ADMIN_CREATE_USER_SUBPATH}>Create User</Link>
        </Button>
    </div>
  );
};

export default UsersFilter;
