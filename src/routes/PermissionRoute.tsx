import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store";
import {
  selectIsAdmin,
  selectPermissions,
} from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
  permissions?: string[];
}

const PermissionRoute: FC<Props> = ({ permissions }) => {
  const userPermissions = useAppSelector(selectPermissions);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (isAdmin) return <Outlet />;

  if (!permissions) return <Outlet />;
  let isAllow = false;
  for (const role of userPermissions) {
    if (role !== undefined && permissions.includes(role)) {
      isAllow = true;
      break;
    }
  }

  return isAllow ? <Outlet /> : <Navigate to="unauthorized" />;
};

export default PermissionRoute;
