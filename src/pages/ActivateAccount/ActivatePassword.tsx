import { Formik, FormikHelpers } from "formik";
import { Form, Input, SubmitButton } from "formik-antd";
import { Row, Alert} from 'antd'
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import styles from "./index.module.css";
import * as Yup from "yup";
import { useAppDispatch } from "../../store";
import { actionResetPassword } from "../../store/authentication/action";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {firstLetterUppercase} from '../../utils'
import {AUTH_PATH, ACTIVATE_PASSWORD_SUCCESS_SUBPATH} from '../../constants/routes'

const initialValues = {
  password: ""
};

const validationSchema = Yup.object({
  password: Yup.string().trim()
  .required("Password is required")
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
  "Password must be 8-16 characters and contain both numbers and letters characters" 
  ),
  passwordConfirmation: Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  .required("Password confirmation is required")
  },
  
);


type FormValues = typeof initialValues;

type FieldErrors = {
  Field: string,
  Message: string
}

const ActivatePasswordForm = () => {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const navigate = useNavigate()
  const params = useLocation()

  const handleSubmit = useCallback(
    async (values: FormValues, action: FormikHelpers<FormValues>) => {
      try {
        const token = params.search.slice(4)
        await dispatch(actionResetPassword(values.password, token));
        return navigate(AUTH_PATH + "/" + ACTIVATE_PASSWORD_SUCCESS_SUBPATH)
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
      <h1 style={{ textAlign: "center" }} className={styles["title-form"]}>Create your password</h1>
      <div style={{ margin: "4px 0" }}>
        <Alert
        banner={false} 
        message={<span className={styles["custom-alert-error"]}>{error && error}</span>} 
        className={styles["custom-alert-style"]}
        />
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          
          <Form layout="vertical"
          >
            <Form.Item name="password" label={<span style={{fontWeight:"bold"}}>Password</span>}>
              <Input.Password
                placeholder="New password"
                name="password"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item name="passwordConfirmation" label={<span style={{fontWeight:"bold"}}>Confirm password</span>}>
              <Input.Password
                placeholder="Confirm password"
                name="passwordConfirmation"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Row style={{
              justifyContent:"center", 
              alignItems:"center",
              padding: "19px 0px 14px 0px" 
            }}>
              <SubmitButton 
              className={styles["submit-btn"]} 
              size="large"
              >
                Activate your account
              </SubmitButton>
            </Row>
          </Form> 
        )}
      </Formik>
    </div>
  );
};

export default ActivatePasswordForm;
