import { Formik, FormikHelpers } from "formik";
import { Form, Input, SubmitButton } from "formik-antd";
import {Button, Row, Col, Alert} from 'antd'
import { useCallback, useState } from "react";
import { Link } from 'react-router-dom';
import styles from "./ResetPassword.module.css";
import * as Yup from "yup";
import { useAppDispatch } from "../../store";
import {actionSendEmail} from "../../store/authentication/action";
import {LOGIN_PATH} from "../../constants/routes";
import Swal from "sweetalert2";

const initialValues = {
    email: "",
};

const validationSchema = Yup.object({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
});


type FormValues = typeof initialValues;

type FieldErrors = {
    Field: string,
    Message: string
}
type FieldMessage ={
    Field: string,
    Message: string
}

const SendEmailForm = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useAppDispatch();

    const handleSubmit = useCallback(
      
        async (values: FormValues, action: FormikHelpers<FormValues>) => {
            try{
                await dispatch(actionSendEmail(values.email));
                console.log(values.email)
                Swal.fire({
                    icon: 'success',
                    text: 'An Email with password reset instructions will be send to your email. Please check!',
                  })
            } catch (handleErrors: any) {
                let message = "";
                handleErrors.errors.forEach((error: FieldErrors):void => {
                    message +=  `${error.Message}`;
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
            <h1 style={{ textAlign: "center" }} className={styles["title-form"]}>Reset Password</h1>

            <div style={{ marginTop: "30px", marginBottom:"20px" }}>
               An email will be sent to the address specified with a link to reset your password
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
                        <Form.Item name="email" label={<span style={{fontWeight:"bold", fontSize:"15px"}}>Email</span>} >
                            <Input
                                placeholder="Enter your email"
                                name="email"
                                suffix={<span style={{width: "37px", height: "29px"}} />}
                                prefix={<span />}
                            />
                        </Form.Item>
                        <div style={{ margin: "4px 0" }}>
                            <Alert
                                banner={false}
                                message={<span className={styles["custom-alert-error"]}>{error && error}</span>}
                                className={styles["custom-alert-style"]}
                            />
                        </div>
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
                                    Send
                                </SubmitButton>
                            </Col>
                            <Col span={12} offset={4} style={{textAlign: "right"}}>
                                <Button type="link" htmlType="button" className={styles["custom-link-style"]}  onClick={()=>{console.log("click forget")}}>
                                    <Link to={LOGIN_PATH} style={{textDecoration:"underline"}}>Return to the Login Form</Link>

                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SendEmailForm;
