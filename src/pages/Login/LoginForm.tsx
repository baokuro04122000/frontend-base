import { Formik, FormikHelpers } from "formik";
import { Form, Input, SubmitButton } from "formik-antd";
import {Button, Row, Col, Alert} from 'antd'
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import styles from "./login.module.css";
import * as Yup from "yup";
import { useAppDispatch } from "../../store";
import { actionLogin } from "../../store/authentication/action";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {firstLetterUppercase} from '../../utils'
import { useTranslation } from 'react-i18next'
import {
   SEND_EMAIL_PATH
} from '../../constants/routes'

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
  .required("Password is required")
  .min(5, "Password must be at least 5 characters"),
});


type FormValues = typeof initialValues;

type FieldErrors = {
  Field: string,
  Message: string
}

const LoginForm = () => {
  const { t } = useTranslation();
  
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  
  const handleSubmit = useCallback(
    async (values: FormValues, action: FormikHelpers<FormValues>) => {
        try {
        await dispatch(actionLogin(values.email, values.password));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (handleErrors: any) {
        let message = "";
        handleErrors.errors.forEach((error: FieldErrors):void => {
          message +=  `${firstLetterUppercase(error.Field)}: ${firstLetterUppercase(error.Message)}`;
        })
        setError(message);
      } finally {
        action.setSubmitting(false);
      }
    },
    [dispatch]
  );
  
  return (
    <div className={styles["form-wrapper"]}>
      <h1 style={{ textAlign: "center" }} className={styles["title-form"]}>{t('login.login')}</h1>
      <div style={{ margin: "4px 0" }}>
        <Alert
        banner={false} 
        message={<span className={styles["custom-alert-error"]}>{error && error}</span>} 
        className={styles["custom-alert-style"]}
        />
        {/* {error && <Alert message={error} type="error" />} */}
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          
          <Form layout="vertical"
          >
            <Form.Item name="email" label={<span style={{fontWeight:"bold"}}>{t('login.email')}</span>} >
              <Input
                placeholder="Enter your email" 
                name="email" 
                suffix={<span />} 
                prefix={<span />} 
              />
            </Form.Item>
            <Form.Item name="password" label={<span style={{fontWeight:"bold"}}>{t('login.password')}</span>}>
              <Input.Password
                placeholder="Enter your password"
                name="password"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Row style={{
              justifyContent:"center", 
              alignItems:"center",
              padding: "19px 0px 14px 0px" 
            }}>
              <Col span={8}>
                <SubmitButton 
                className={styles["submit-btn"]} 
                size="large"
                >
                  {t('login.login')}
                </SubmitButton>
              </Col>
              <Col span={12} offset={4} style={{textAlign: "right"}}>
                <Button type="link" htmlType="button" className={styles["custom-link-style"]}  >
                  <Link to={SEND_EMAIL_PATH} style={{textDecoration:"underline"}}>{t('login.forgotten_password')}</Link>
                </Button>
              </Col>
            </Row>
          </Form> 
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
