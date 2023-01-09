import styles from './index.module.css'
import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Table, Switch } from 'antd'
import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import { ColumnsType } from 'antd/lib/table';
import { useAppDispatch, useAppSelector } from '../../store'
import { setPermissionList, setRoleByID } from '../../store/admin/slice'
import { actionGetRoleByID, actionGetPermissionList } from '../../store/admin/action'
import { PermissionNewDetail } from '../../api/openapi-generator'
import { useTranslation } from 'react-i18next'

const AssignRole = () => {
  const {t} = useTranslation()


  const { role_id } = useParams()
  const roleDetail = useAppSelector(({admin}) => admin.roleByID)
  const permissionList = useAppSelector(({admin}) => {

    const list = admin.permissionList.map(permission => {
      const isExisted = roleDetail?.permissions?.filter((per) => per.id === permission.id).length 
      if(isExisted){
        return {
          id: Number(permission.id),
          name:permission.name,
          status: true
        }
      }
      return {
        id: Number(permission.id),
        name:permission.name,
        status: false
      }
    })
    setPermissionList(list)
    return list  
  })

  const [roleName, setRoleName] = useState(roleDetail?.name)
  const [errorName, setErrorName] = useState('')
  //const [permissions, setPermissions] = useState(permissionList)
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(actionGetRoleByID(Number(role_id))).then((name) =>{
      setRoleName(name)
    })
    dispatch(actionGetPermissionList())
    return () => {
      dispatch(setRoleByID(undefined))
      dispatch(setPermissionList([]))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  const handleChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleName(e.target.value)
    if(!e.target.value.trim()){
      setErrorName(t('errors.role_name_required'))
      return
    }
    setErrorName('')
    return
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleName])

  const handleClickToggle = (id: string | number | undefined) => {
    //not done yet
    return
  }

  const columns: ColumnsType<PermissionNewDetail> & { dataIndex?: keyof PermissionNewDetail }[]   = 
    useMemo(() => 
      [{
        title: <span className={styles['title-table']}>{t('edit_role.sections')}</span>,
        dataIndex: 'name',
        render: (_text, record) => {
          return <span>{record.name}</span>
        }
      },
      {
        title: <span className={styles['title-table']}>{t('edit_role.permissions')}</span>,
        dataIndex: 'id',
        key:"id",
        render: (text, record) => {
          return <span>View | Create | Edit services</span>
        }
      },
      {
        title: <span className={styles['title-table']}>{t('edit_role.on_off')}</span>,
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked={record.status} onClick={() =>{
              handleClickToggle(record.id)              
            }}/>
          )
        }
      }]
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ,[])
  
  return (
    <>
      <Row>
        <Col span={20} style={{minHeight: "55px"}}>
          <Input 
            type="text"
            placeholder='Enter a name...'
            className={errorName.trim() ? styles['style-error-input'] : ''}
            value={roleName}
            onChange = {handleChangeName}
          />
          {errorName.trim() 
          ? (<span className={styles['style-error-message']}>{errorName}</span>)
          : <></>
          }
          
        </Col>
      </Row>
      <Row style={{marginTop: "10px"}}>
        <Col span={24}>
          <h2 className={styles['title-feature']}>{t('edit_role.assign_access')}</h2>
        </Col>
        <Col span={24}>
          <span style={{
            color:"rgb(158 158 158)",
            fontSize:"18px"
          }}>{t('edit_role.notify_role')}</span>
        </Col>
      </Row>
      <Row style={{
        marginTop: "8px",
        minHeight:"418px"
      }}>
        <Col span={24}>
          <Table 
            dataSource={permissionList} 
            columns={columns} 
            pagination={false}
            rowKey={() => uuidv4()}
            scroll={
              {
                y: 400
              }
            }
            
          />
        </Col>
      </Row>
    </>
  )
};

export default AssignRole;


