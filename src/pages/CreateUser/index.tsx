import { Link } from 'react-router-dom'
import {SwapLeftOutlined} from '@ant-design/icons'
import FormCreateUser from './FormCreateUser'

import styles from './index.module.css'
import {ADMIN_PATH, ADMIN_USERS_SUBPATH} from '../../constants/routes'
import { useTranslation } from 'react-i18next'

const CreateUser = () => {
  const {t} = useTranslation()
  return (
    <>
      <div className={styles['style-back-to-page']}>
        <Link to={ADMIN_PATH + "/"+ ADMIN_USERS_SUBPATH} style={{color:"rgba(0, 0, 0, 0.85"}}>
          <SwapLeftOutlined /> {t('create_user.back_to_page')}
        </Link>
      </div>
      <div className={styles['wrapper']}>
        <FormCreateUser/>
      </div>
    </>
  );
};

export default CreateUser;