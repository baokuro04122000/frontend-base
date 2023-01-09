import * as Yup from "yup";
import { useCallback, useState } from "react";
import { useAppDispatch } from "../../store";
import { Formik, FormikHelpers } from "formik";
import { actionResetPassword } from "../../store/authentication/action";
import styles from "../Login/login.module.css";
import { Alert, Col, Image, Row } from "antd";
import { Form, Input, SubmitButton } from "formik-antd";
import { Link, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../../constants/routes";
import Swal from "sweetalert2";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const initialValues = {
    password: "",
    confirmPassword: "",
    jt: ''
};

const validationSchema = Yup.object({
    password: Yup.string().trim()
        .required("Password is required")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
            "Password must be 8-16 characters and contain both numbers and letters characters"
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required("Password confirmation is required")
});


type FormValues = typeof initialValues;

type FieldErrors = {
    Field: string,
    Message: string
}
const ResetPassWordForm = () => {
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false)
    const dispatch = useAppDispatch();
    const { search } = useLocation();
    const jt = search.substring(4)
    
    const handleSubmit = useCallback(
        async (values: FormValues, action: FormikHelpers<FormValues>) => {
            try {
                await dispatch(actionResetPassword(values.password, jt));
                console.log(values)
                Swal.fire({
                    icon: 'success',
                    text: 'Your password is changed!',
                    footer: `<a href=${LOGIN_PATH}>Return to Login Form</a>`,
                })
            } catch (handleErrors: any) {
                let message = "";
                handleErrors.errors.forEach((error: FieldErrors): void => {
                    message += `${error.Field}: ${error.Message}`;
                })
                setError(message);
            } finally {
                action.setSubmitting(false);
            }

        },
        [dispatch]
    );

    const handleShowPassword = (): void => {
        setShowPass((pre) => {
            return !pre
        })
    }
    return (
        <div className={styles.wrapper}>
            {/*<h1>Reset Account Password</h1>*/}
            <div className={styles["form-wrapper"]}><h1 style={{ textAlign: "center" }} className={styles["title-form"]}>Reset Account Password</h1>
                <div style={{ margin: "4px 0" }}>

                    {/* {error && <Alert message={error} type="error" />} */}
                </div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {() => (

                        <Form layout="vertical"
                        //  onChange={() => setError("")}
                        >
                            <Form.Item name="password" label={<span style={{ fontWeight: "bold" }}>New Password</span>} >
                                <Input.Password
                                    placeholder="Enter your password"
                                    name="password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />

                            </Form.Item>
                            <Form.Item name="confirmPassword" label={<span style={{ fontWeight: "bold" }}>Confirm New Password</span>}>
                                <Input.Password
                                    placeholder="Confirm new password"
                                    name="confirmPassword"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Alert
                                banner={false}
                                message={<span className={styles["custom-alert-error"]}>{error && error}</span>}
                                className={styles["custom-alert-style"]}
                            />
                            <Row style={{
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "19px 0px 14px 0px"
                            }}>
                                <Col span={8}>
                                    <SubmitButton
                                        className={styles["submit-btn"]}
                                        size="large"
                                    >
                                        Submit
                                </SubmitButton>
                                </Col>

                            </Row>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassWordForm