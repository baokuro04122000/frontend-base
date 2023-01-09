import { Avatar, Button, Grid, Layout as AntdLayout, Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { FC, useCallback, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ADMIN_PATH,
  ADMIN_USERS_SUBPATH,
  DASHBOARD_CONTRACTS_SUBPATH,
  DASHBOARD_PATH,
  DASHBOARD_REQUESTS_SUBPATH,
  ADMIN_ROLE_LIST_SUBPATH
} from "../constants/routes";
import { useAppDispatch, useAppSelector } from "../store";
import { actionLogout } from "../store/authentication/action";
import { HomeOutlined, TeamOutlined, UnorderedListOutlined, BarChartOutlined  } from '@ant-design/icons'
import styles from "./index.module.css";
import { useTranslation } from 'react-i18next'
const { Content, Footer, Sider } = AntdLayout;

const CONTRACTS_LINK = `${DASHBOARD_PATH}${DASHBOARD_CONTRACTS_SUBPATH}`;
const REQUESTS_LINK = `${DASHBOARD_PATH}${DASHBOARD_REQUESTS_SUBPATH}`;
const USERS_LINK = `${ADMIN_PATH}/${ADMIN_USERS_SUBPATH}`;
const ROLE_LIST_LINK = `${ADMIN_PATH}/${ADMIN_ROLE_LIST_SUBPATH}`
interface Props {
  page: "dashboard" | "admin";
}

const Layout: FC<Props> = ({ page }) => {
  const {t} = useTranslation()
  const loginUserFullName = useAppSelector(
    (state) => state.authentication.authUser?.data?.full_name
  );
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { md } = Grid.useBreakpoint();

  
  const items: ItemType[] = useMemo(() => {
    if (page === "dashboard") {
      return [
        {
          label: <Link to={CONTRACTS_LINK}>{t('layout.menu_contracts')}</Link>,
          key: CONTRACTS_LINK,
        },
        { label: <Link to={REQUESTS_LINK}>REQUESTS</Link>, key: REQUESTS_LINK },
      ];
    }

    if (page === "admin") {
      return [
        { 
          label:t('layout.menu_user_management') , 
          key: USERS_LINK,
          icon: <TeamOutlined />,
          children: [
            {label: <Link to={USERS_LINK} >{t('layout.menu_users')}</Link>, key:USERS_LINK, icon:<HomeOutlined />},
            {label: <Link to={ROLE_LIST_LINK}>{t('layout.menu_roles')}</Link>, key:ROLE_LIST_LINK, icon:<UnorderedListOutlined />}
          ],
          theme:"light"  
        },
        {label: <Link to={'#'}>{t('layout.menu_subscription')}</Link>, key:"#", icon: <BarChartOutlined />}
      ];
    }

    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);



  const contentMargin = useMemo(() => {
    if (!md) return "12px 8px 0";
    return "24px 16px 0";
  }, [md]);

  const handleLogout = useCallback(() => dispatch(actionLogout()), [dispatch]);

  return (
    <AntdLayout className={styles["layout-wrapper"]}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={styles["logo"]}>
          DASHBOARD
        </div>
        <Menu
          theme="dark"
          mode="inline"
          inlineIndent={20}
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <AntdLayout>
        <Header
          style={{
            padding: "10px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3",
            background: "#fff",
          }}
        >
         <Menu
          theme="light"
          mode="horizontal"
          overflowedIndicator={<></>}
          inlineIndent={20}
          selectedKeys={[location.pathname]}
          items={items}
        /> 
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {loginUserFullName && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  {loginUserFullName.charAt(0).toUpperCase()}
                </Avatar>
                <span>{loginUserFullName}</span>
              </div>
            )}
            <Button onClick={handleLogout} danger>
              {t('layout.logout_btn')}
            </Button>
          </div>
        </Header>
        <Content style={{ margin: contentMargin, maxHeight:"79vh", overflow:"overlay" }}>
          <div style={{ padding: "0px 12px", width: "100%", height: "100%" , position: "relative"}}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {t('layout.footer_text')}
        </Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
