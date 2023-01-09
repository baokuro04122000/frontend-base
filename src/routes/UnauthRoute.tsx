import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  ADMIN_PATH,
  ADMIN_USERS_SUBPATH,
  DASHBOARD_CONTRACTS_SUBPATH,
  DASHBOARD_PATH,
} from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAdmin, selectIsAuth } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const UnauthRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isAuth) return <Outlet />;
  if (isAdmin) return <Navigate to={ADMIN_PATH + "/" + ADMIN_USERS_SUBPATH} />;
  return isAuth ? (
    <Navigate to={DASHBOARD_PATH + DASHBOARD_CONTRACTS_SUBPATH} />
  ) : (
    <Outlet />
  );
};

export default UnauthRoute;
