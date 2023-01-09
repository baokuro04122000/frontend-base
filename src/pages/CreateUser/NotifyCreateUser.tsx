import { SwapLeftOutlined } from "@ant-design/icons";
import { Button, Space, Form, Checkbox, Row } from "antd";
import { Link } from "react-router-dom";
import { ADMIN_PATH, ADMIN_USERS_SUBPATH, ADMIN_CREATE_USER_SUBPATH } from "../../constants/routes";
import styles from './index.module.css'

const LINK_CREATE_USER = ADMIN_PATH + "/" + ADMIN_USERS_SUBPATH + "/" + ADMIN_CREATE_USER_SUBPATH;
const NotifyCreateUser = () => {
  return (
    <>
      <div className={styles['style-back-to-page']}>
        <Link to={ADMIN_PATH + "/"+ ADMIN_USERS_SUBPATH} style={{color:"rgba(0, 0, 0, 0.85"}}>
          <SwapLeftOutlined /> Back to users
        </Link>
      </div>
      <div className={styles['wrapper']}>
        <div className={styles["notify-form-wrapper"]}>
            
          <Space>
            <Checkbox checked={true} disabled={false} className={styles['style-checkbox-notify']} >       
            </Checkbox>
            <span className={styles['notify-form-title']}>User 1 has been created</span> 
          </Space>
            
          <Form layout="vertical"
          >
            <Space direction="vertical" size="large" style={{gap: "30px !important"}}>
              <Row style={{height: "120px"}}>
                <span className={styles['style-message-notify']}>
                  An email will be sent to users email address with a link to active the account
                </span>
              </Row>
              <Row style={{
                justifyContent:"flex-start", 
                alignItems:"center",
                padding: "19px 0px 14px 0px" 
              }}>
                <Space>
                  <Button 
                  className={styles["submit-btn"]} 
                  size="large"
                  >
                    <Link to={LINK_CREATE_USER}> Create another user </Link>
                    
                  </Button>
                  <Button 
                  className={styles["submit-btn"]} 
                  size="large"
                  >
                    Go to user profile
                  </Button>
                </Space>
              </Row>
            </Space>
          </Form>
        </div>
      </div>
    </>
  );
};

export default NotifyCreateUser;