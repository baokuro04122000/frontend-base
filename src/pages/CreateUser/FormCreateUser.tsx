import { Formik, FormikHelpers } from "formik";
import { Form, Input, SubmitButton, Select } from "formik-antd";
import {Row, Col, Alert} from 'antd'
import type {SelectProps} from 'formik-antd'
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import styles from "./index.module.css";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../store";
import { firstLetterUppercase } from '../../utils'
import { actionCreateUser } from '../../store/admin/action'
import { actionGetRoles } from '../../store/authentication/action'
import { setRoles } from '../../store/authentication/slice'
import { RoleDetail } from "../../api/openapi-generator";
import { ADMIN_PATH, ADMIN_USERS_SUBPATH, ADMIN_CREATE_USER_SUCCESS_SUBPATH } from '../../constants/routes'
import { useTranslation } from 'react-i18next'
const LINK_CREATE_USER_SUCCESS = ADMIN_PATH + "/" + ADMIN_USERS_SUBPATH + "/" + ADMIN_CREATE_USER_SUCCESS_SUBPATH

const initialValues = {
  name:"",
  email: "",
  roles: [],
};





type FormValues = typeof initialValues;

type FieldErrors = {
  Field: string,
  Message: string
}

interface ItemProps {
  label:string ;
  value: number ;
}


const CreateUserForm = () => {
  const {t} = useTranslation()
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t("errors.email_required"))
      .email(t("errors.email_invalid")),
    name: Yup.string()
    .required(t("errors.name_required")),
    roles: Yup.array().min(1, t("errors.roles_required"))
  });

  const roles: ItemProps[] = useAppSelector(({authentication}) => {
    const listRoles = [...authentication.roles]
    const options: ItemProps[] = [];
    listRoles.forEach((role: RoleDetail) => {
      if(role.name && role.id){
        options.push({
          label: role.name,
          value: role.id
        })
      }
    }
    )
    return options
  })
  const [error, setError] = useState("");
  const [value, setValue] = useState([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(actionGetRoles())
    return () => {
      dispatch(setRoles([]))
    }
  }, [dispatch])

  
  const selectProps: SelectProps = {
    mode: 'multiple',
    name:"roles",
    value,
    options: roles,
    showArrow:true,
    dropdownMatchSelectWidth:false,
    onChange: (newValue: string[] & []) => {
      setValue(newValue);
    },
    placeholder: t('create_user.placeholder_select'),
    maxTagCount: 'responsive',
    listHeight:185,
    showSearch:true,
    
  };

  const handleSubmit = useCallback(
    async (values: FormValues, action: FormikHelpers<FormValues>) => {  
      try {
          const listRoles: number[] = []
          values.roles.forEach((id) => {
            listRoles.push(id)
          })
          const isSuccess: boolean = await dispatch(actionCreateUser({
            full_name: values.name,
            email: values.email,
            role: listRoles
          }))
          if(isSuccess){
            return navigate(LINK_CREATE_USER_SUCCESS)
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );
  
  return (
    <div className={styles["form-wrapper"]}>
      <h1 className={styles["title-form"]}>{t('create_user.title_form')}</h1>
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
            <Form.Item name="name" label={<span style={{fontWeight:"bold"}}>{t('create_user.name')}</span>}>
              <Input
                placeholder={t('create_user.placeholder_name')}
                name="name"
              />
            </Form.Item>
            <Form.Item name="email" label={<span style={{fontWeight:"bold"}}>{t('create_user.email')}</span>} >
              <Input
                placeholder={t('create_user.placeholder_email')} 
                name="email" 
                suffix={<span />} 
                prefix={<span />} 
                
              />
            </Form.Item>

            <Form.Item name="roles" label={<span style={{fontWeight:"bold"}}>{t('create_user.roles')}</span>} >
              <Select {...selectProps} />
            </Form.Item>
            <Row style={{
              justifyContent:"flex-start", 
              alignItems:"center",
              padding: "19px 0px 14px 0px" 
            }}>
              <Col span={8}>
                <SubmitButton 
                className={styles["submit-btn"]} 
                size="large"
                >
                  {t('create_user.button_submit')}
                </SubmitButton>
              </Col>
            </Row>
          </Form> 
        )}
      </Formik>
    </div>
  );
};

export default CreateUserForm;
