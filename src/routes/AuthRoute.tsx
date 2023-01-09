import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LOGIN_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const AuthRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  return <Outlet />;
};

export default AuthRoute;
