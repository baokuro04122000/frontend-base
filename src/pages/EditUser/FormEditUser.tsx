import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import React, { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ADMIN_PATH } from "../../constants/routes"
import styles from './index.module.css'
import { Alert, Col, Row, Space, Tag } from 'antd';
import { Button, Select } from 'antd';
import { Form as FormAntd, Input as InputAntd } from 'antd'
import { Input, Form, SubmitButton } from 'formik-antd';
import * as Yup from "yup";
import moment from 'moment'
import 'reactjs-popup/dist/index.css';
import { useAppDispatch, useAppSelector } from "../../store"
import { Formik, FormikHelpers } from "formik"
import { actionGetRoles } from "../../store/authentication/action"
import type { SelectProps } from 'formik-antd';
import { RoleDetail } from "../../api/openapi-generator"
import { setRoles } from "../../store/authentication/slice"
import { actionAssignRole, actionUpdateStatus, actionAdminResetPassword, actionGetUsersById } from "../../store/admin/action"
import { setUserById } from "../../store/admin/slice"
import ModalChangePassword from '../../components/Modals/Modal'
const initialValues = {
    id: "",
    roles: [],
    password: "",
    confirmPassword: "",
    name: ""
}

interface ItemProps {
    label: string;
    value: number;
}

type FormValues = typeof initialValues;

// Validate Password
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

const FormEditUser = () => {
    const userRoles = useAppSelector(({ admin }) =>
        admin.userInfor?.roles?.map((role) => {
            return Number(role.id)
        }))
    const userInfo = useAppSelector(({ admin }) => admin.userInfor)
    const createDate = moment(userInfo?.created_at).format('MMMM Do YYYY, h:mm:ss a')
    const [success, setSuccess] = useState("")
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(userRoles);

    const [active, setActive] = useState(userInfo?.status)
    const [userName, setUserName] = useState(userInfo?.full_name)
    const dispatch = useAppDispatch()
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(actionGetUsersById(+id)).then(value => {
                setActive(value.status)
                setUserName(value.full_name)
                setValue(value?.roles?.map((role) => {
                    return Number(role.id)
                }))
            })
        }
        dispatch(actionGetRoles())
        return () => {
            dispatch(setRoles([]))
            dispatch(setUserById({}))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])
    const showModal = () => {
        setOpen(true);
    };

    // Assign roles
    const roles: ItemProps[] = useAppSelector(({ authentication }) => {
        const listRoles = [...authentication.roles]
        const options: ItemProps[] = [];
        listRoles.forEach((role: RoleDetail) => {
            if (role.name && role.id) {
                options.push({
                    label: role.name,
                    value: role.id
                })
            }
        }
        )
        return options
    })

    const selectProps: SelectProps =
    {
        mode: 'multiple',
        name: "roles",
        options: roles,
        value,
        showArrow: true,
        dropdownMatchSelectWidth: false,
        onChange: (newValue: string[] & []) => {
            setValue(newValue);
        },
        placeholder: 'Choose roles',
        maxTagCount: 'responsive',
        listHeight: 185,
        showSearch: true,
    }

    //change status
    const handleActive = useCallback(async () => {
        try {
            await dispatch(actionUpdateStatus({
                id: userInfo?.id,
                is_active: !active
            }))
            setActive((pre) => !pre)
        } catch (error) {
            console.log(error)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, active])

    // change password
    const handleSubmit = useCallback(
        async (values: FormValues, action: FormikHelpers<FormValues>) => {
            try {
                console.log(await dispatch(actionAdminResetPassword({
                    id: userInfo?.id,
                    password: values?.password
                })))
                setSuccess("Password is changed!")
                return
            } catch (error) {
                console.log(error)
            } finally {
                action.setSubmitting(false)
            }
        }, [dispatch, userInfo]
    )


    //change name - roles 
    const handleChangeName = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName])

    const handleSubmitEdit = useCallback(async () => {
        if (userName === userInfo?.full_name && JSON.stringify(userRoles) === JSON.stringify(value)) {
            return
        }
        if (userName === userInfo?.full_name) {
            await dispatch(actionAssignRole({
                id: userInfo?.id,
                role_ids: value,
                user_name: '',
            }))
            setSuccess("Roles are changed!")
            return
        }

        await dispatch(actionAssignRole({
            id: userInfo?.id,
            role_ids: value,
            user_name: userName,
        }))
        setSuccess('Information is changed!')
        return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, userInfo, value, userName])

    return (
        <div className={styles["wrapper"]}>
            <div style={{ display: "flex" }}>
                <Link to={ADMIN_PATH} style={{ marginRight: "10px" }}><ArrowLeftOutlined /></Link>
                <InputAntd
                    name="name"
                    placeholder="name"
                    value={userName}
                    onChange={handleChangeName}

                />
            </div>
            <div style={{ marginTop: "30px" }}>
                <Row>
                    {/* Profile */}
                    <Col span={14}>

                        <FormAntd
                            className={styles["form-profile"]}

                            layout="vertical"
                        >
                            <FormAntd.Item label="Profile" style={{ borderBottom: "solid 1px gray" }}>
                            </FormAntd.Item>
                            <FormAntd.Item label="Email">
                                {userInfo?.email}
                            </FormAntd.Item>
                            <FormAntd.Item label="Role" className={styles["form-selector"]}
                                rules={[{ required: true }]}
                            >
                                <Select  {...selectProps} />

                                <span></span>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                </Space>
                            </FormAntd.Item>
                        </FormAntd>
                    </Col>
                    {/* Status - Change password */}
                    <Col span={2}></Col>
                    <Col span={8}>

                        <FormAntd
                            className={styles["form-profile"]}
                            initialValues={initialValues}
                            layout="vertical"
                        >
                            <FormAntd.Item style={{ borderBottom: "solid 1px gray" }}>
                                <Button type="text"
                                    onClick={handleActive}
                                    className={styles["btn-status"]}
                                    style={{ width: "100%" }}
                                >
                                    {active ? (<Tag color="orange" style={{ width: "100%" }}>Deactive</Tag>) : (<Tag color="green" style={{ width: "100%" }}>Active</Tag>)}
                                </Button>
                            </FormAntd.Item>

                            <FormAntd.Item name="change_password">
                                <Button onClick={showModal}
                                    className={styles["btn-changePass"]}
                                >
                                    Change Password
                                </Button>
                                <ModalChangePassword
                                    style={{}}
                                    title={<span>Change Password</span>}
                                    open={open}
                                    onCancel={() => {
                                        setOpen(false)
                                    }}
                                >
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {() => (
                                            <>

                                                <Form layout="vertical">
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
                                                    <Form.Item name="submit">
                                                        <SubmitButton>OK</SubmitButton>
                                                    </Form.Item>
                                                    <Row style={{
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        padding: "19px 0px 14px 0px"
                                                    }}>

                                                    </Row>
                                                </Form>
                                            </>
                                        )}
                                    </Formik>


                                </ModalChangePassword>
                            </FormAntd.Item>
                            <FormAntd.Item name="status" label="Status" className={styles["form-selector"]}>
                                {!active ? (<Tag color="orange" >Deactive</Tag>) : (<Tag color="green">Active</Tag>)}
                            </FormAntd.Item>
                            <FormAntd.Item name="time" label="User created:" className={styles["form-selector"]}>
                                <span>{createDate}</span>
                            </FormAntd.Item>
                            <FormAntd.Item name="update" label="User last updated:" className={styles["form-selector"]}>
                                <span>{userInfo?.updatedat}</span>
                            </FormAntd.Item>
                        </FormAntd>
                    </Col>
                </Row>
            </div>
            <div className={styles["footer"]}>
                {success.trim() ? (
                    <Alert message={success} type="success" closable />
                ) : <></>}

                <Button type="primary" className={styles["btn-save"]} onClick={handleSubmitEdit} >
                    Save
                </Button>
            </div>

        </div>
    )
}
export default FormEditUser