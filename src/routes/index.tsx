import { Navigate, Outlet, Route, Routes as ReactRoutes } from "react-router-dom";
import {
  VIEW_ALL_CONTRACT_LIST,
  VIEW_CONTRACT_LIST,
  VIEW_ADMIN,
  VIEW_REQUEST_LIST,
} from "../constants/authorization";
import {
  ADMIN_HOME_SUBPATH,
  ADMIN_PATH,
  ADMIN_UNAUTHORIZED_SUBPATH,
  ADMIN_USERS_SUBPATH,
  DASHBOARD_CONTRACTS_SUBPATH,
  DASHBOARD_HOME_SUBPATH,
  DASHBOARD_PATH,
  DASHBOARD_REQUESTS_SUBPATH,
  DASHBOARD_UNAUTHORIZED_SUBPATH,
  LOGIN_SUBPATH,
  AUTH_PATH,
  SEND_EMAIL_SUBPATH,
  RESET_PASSWORD_SUBPATH,
  ADMIN_CREATE_USER_SUBPATH,
  ADMIN_CREATE_USER_SUCCESS_SUBPATH,
  ACTIVATE_PASSWORD_SUBPATH,
  ACTIVATE_PASSWORD_SUCCESS_SUBPATH,
  ADMIN_EDIT_USER_SUBPATH,
  ADMIN_ROLE_LIST_SUBPATH,
  ADMIN_EDIT_ROLE

} from "../constants/routes";

import { RouteConfig } from "../interfaces/routes";
import Layout from "../layout";
import Contracts from "../pages/Contracts";
import ResetPassword from "../pages/ResetPassword";
import ActivatePassWord from "../pages/ActivateAccount";
import NotifyActivate from "../pages/ActivateAccount/NotifyActiateUser";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Requests from "../pages/Requests";
import Unauthorized from "../pages/Unauthorized";
import Users from "../pages/Users";
import CreateUser from '../pages/CreateUser'
import NotifyCreateUser from "../pages/CreateUser/NotifyCreateUser";
import AuthRoute from "./AuthRoute";
import PermissionRoute from "./PermissionRoute";
import UnauthRoute from "./UnauthRoute";
import ResetPassWordForm from "../pages/ResetPassword/ResetPassWordForm";
import EditUser from "../pages/EditUser";
import RoleList from '../pages/Roles'
import EditRole from '../pages/EditRole'

const unauthRoutes: RouteConfig = {
  path: AUTH_PATH,
  element: <Outlet />,
  guard: <UnauthRoute />,
  children :[
    {
      path:LOGIN_SUBPATH,
      element: <Login/>
    },
    {
      path: SEND_EMAIL_SUBPATH,
      element:<ResetPassword/>
    },
    {
      path: RESET_PASSWORD_SUBPATH,
      element: <ResetPassWordForm/>
    },
    {
      path: ACTIVATE_PASSWORD_SUBPATH,
      element: <ActivatePassWord/>
    },
    {
      path:ACTIVATE_PASSWORD_SUCCESS_SUBPATH,
      element: <NotifyActivate/>
    }
  ]
};

const adminRoutes: RouteConfig = {
  path: ADMIN_PATH,
  guard: <AuthRoute />,
  element: <Layout page="admin" />,
  children: [
    {
      path: ADMIN_HOME_SUBPATH,
      element: <Navigate to={ADMIN_USERS_SUBPATH} />,
      permissions: [VIEW_ADMIN],
    },
    {
      path: ADMIN_USERS_SUBPATH,
      element: <Users />,
      permissions: [VIEW_ADMIN],
    },
    {
      path: ADMIN_USERS_SUBPATH+"/"+ADMIN_CREATE_USER_SUBPATH,
      element: <CreateUser />,
      permissions: [VIEW_ADMIN],
    },
    {
      path: ADMIN_USERS_SUBPATH+"/"+ADMIN_EDIT_USER_SUBPATH+"/:id",
      element: <EditUser />,
      permissions: [VIEW_ADMIN]
    },
    {
      path: ADMIN_USERS_SUBPATH+"/"+ADMIN_CREATE_USER_SUCCESS_SUBPATH,
      element: <NotifyCreateUser />,
      permissions: [VIEW_ADMIN],
    }
    ,
    {
      path: ADMIN_ROLE_LIST_SUBPATH,
      element: <RoleList/>,
      permissions: [VIEW_ADMIN]
    },
    {
      path: ADMIN_ROLE_LIST_SUBPATH + "/" + ADMIN_EDIT_ROLE,
      element: <EditRole/>,
      permissions: [VIEW_ADMIN]
    },
    {
      path: ADMIN_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />,
    }
  ],
};

const dashboardRoutes: RouteConfig = {
  path: DASHBOARD_PATH,
  guard: <AuthRoute />,
  element: <Layout page="dashboard" />,
  children: [
    {
      path: DASHBOARD_HOME_SUBPATH,
      element: <Navigate to={DASHBOARD_CONTRACTS_SUBPATH} />,
    },
    {
      path: DASHBOARD_REQUESTS_SUBPATH,
      element: <Requests />,
      permissions: [VIEW_REQUEST_LIST],
    },
    {
      path: DASHBOARD_CONTRACTS_SUBPATH,
      element: <Contracts />,
      permissions: [VIEW_ALL_CONTRACT_LIST, VIEW_CONTRACT_LIST],
    },
    {
      path: DASHBOARD_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />,
    },
  ],
};

const notfoundRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
};

const routes = [unauthRoutes, adminRoutes, dashboardRoutes, notfoundRoute];

const Routes = () => {
  return (
    <ReactRoutes>
      {routes.map((route) => (
        <Route key={route.path} element={route.guard}>
          <Route element={<PermissionRoute permissions={route.permissions} />}>
            <Route path={route.path} element={route.element}>
              {route.children
                ? route.children.map(({ element, path, permissions }) => (
                    <Route key={path} element={route.guard}>
                      <Route
                        element={<PermissionRoute permissions={permissions} />}
                      >
                        <Route path={path} element={element} />
                      </Route>
                    </Route>
                  ))
                : null}
            </Route>
          </Route>
        </Route>
      ))}
    </ReactRoutes>
  );
};

export default Routes;
