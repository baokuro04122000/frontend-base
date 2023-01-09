import React, { useState, useTransition } from 'react';
import { Button } from "antd"
import { SearchOutlined } from '@ant-design/icons';
import {Form, Input} from 'formik-antd'
import { Formik } from 'formik'
import FilterWrapperTable from "../../components/Table/FilterWrapperTable"
import ModalCreateRole from '../../components/Modals/Modal';
import styles from './index.module.css'
import * as Yup from 'yup'
import { useAppDispatch } from '../../store';
import  { setRolesFilterName, setCreateRoleSuccess } from '../../store/admin/slice'
import { actionCreateRole } from '../../store/admin/action'
import { useTranslation } from 'react-i18next'
const initialValues = {
  search: ""
};

const initialRole = {
  roleName: ""
}



const RolesFilter: React.FC = () => {
  const {t} = useTranslation()

  const validationSchema = Yup.object({
    roleName: Yup.string()
    .required(t('errors.role_name_required'))
  })
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition()
  const [roleName, setRoleName] = useState("")
  const [isExisted, setIsExisted] = useState(false)
  const dispath = useAppDispatch();
  

  const handleCreateRole = () => {
    setOpen(true)
  }
  const handleSearchByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      dispath(setRolesFilterName(e.target.value))
    })
  }
  const handleSubmitCreate =async () => {
    try {
      if(!roleName.trim()){
        return
      }
      await dispath(actionCreateRole({name:roleName}))
      dispath(setCreateRoleSuccess(true))
      setOpen(false)
    } catch (error) {
      setIsExisted(true)
    }
  }
  return (
    <FilterWrapperTable label="Roles">
        <Formik
          initialValues={initialValues}
          onSubmit = {()=>{return}}
        >
          <Form layout="inline" className={styles['wrapper']}>
            <Form.Item name="search">
              <Input
                  name="search"
                  placeholder={t('roles.placeholder_role_name')}
                  prefix={<SearchOutlined  
                    style={{
                      fontSize: 16,
                      color: '#1890ff',
                      borderRight: "1px solid",
                      padding:"0px 6px 0px 0px"
                    }}/>
                  }
                  onChange={handleSearchByName}
              />
            </Form.Item>
            <ModalCreateRole 
              style={{marginTop:"-9%"}}
              open={open} 
              title={<span style={{fontSize:"20px", fontWeight:"bold"}}>Create a new role</span>}
              onCancel={() => {setOpen(false)}}
              footer={[
                <Button key="submit" type="default"  onClick={handleSubmitCreate}>
                  {t('roles.create_role_btn')}
                </Button>,
              ]}
              
            >
              <Formik
               initialValues={initialRole}
               onSubmit={() => {return}}
               validationSchema={validationSchema}
               
               >
                
                <Form layout='inline' style={{flexDirection: "column", height:'35px'}}>
                  <Form.Item name="roleName" 
                    label={<span>{t('roles.role_name_label')}</span>}
                    
                  >
                    <Input name="roleName"
                      placeholder={t('roles.placeholder_role_name')}
                      style={isExisted ? {border:"1px solid red"} : {}}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        setRoleName(e.target.value)
                        if(isExisted){
                          setIsExisted(false)
                        }
                      }}                         
                    />
                    {isExisted ? <span style={{color:"red"}}>{t('errors.role_name_existed')}</span> : <></>}
                  </Form.Item>
                </Form>
                
              </Formik>
            </ModalCreateRole>
            <Form.Item name="#">
              <Button type="default" onClick={handleCreateRole}>
                {t('roles.create_role_submit')}
              </Button>
            </Form.Item>
          </Form>
        </Formik>    
    </FilterWrapperTable>
  )
}

export default RolesFilter