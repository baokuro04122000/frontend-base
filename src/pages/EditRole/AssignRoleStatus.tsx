import { Card, Tag } from 'antd'
import styles from './index.module.css'
import { useAppSelector } from '../../store'
import { formatTime } from '../../utils'
import { useTranslation } from 'react-i18next'
const AssignRoleStatus = () => {
  const {t} = useTranslation()
  const roleDetail = useAppSelector(({admin}) => admin.roleByID)
  
  return (
    <div className={styles['card-info']}>
      <Card 
        title={roleDetail?.status ? t('edit_role.inactive') : t("edit_role.active")} 
        bordered={false} 
        style={{ width: 300 }}
        headStyle={
          roleDetail?.status 
          ?{
            background:"hsl(43deg 100% 47%)", 
            textAlign:"center", 
            color:"hsl(0deg 0% 100%)",
          }:{
            background:"#2bc37c", 
            textAlign:"center", 
            color:"hsl(0deg 0% 100%)",
          }
      }
      >
        <div>
          <span style={{
            display:"inline",
            fontSize:"20px",
            fontWeight:"bold",
            padding:"10px 0px"
            
          }}> {t('edit_role.status')} </span>
          <Tag color="green">{t('edit_role.active')}</Tag>
        </div>
        <div style={{
          margin:"10px 0px",
          fontWeight:"bold"
        }}>
          {t('edit_role.role_created')}
        </div>
        <div>
          {formatTime(""+roleDetail?.created_at)}
        </div>
        <div style={{
          margin:"10px 0px",
          fontWeight:"bold"
        }}
        >
          {t('edit_role.role_last_updated')}
        </div>
        <div>
          {formatTime(""+roleDetail?.updated_at)}
        </div>
      </Card>
    </div>
  );
};

export default AssignRoleStatus;