import styles from "./index.module.css";
import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '../../constants/routes'
const NotifyActivate =()=>{
    return (
      <>
        <div className={styles['style-back-to-page']}>
            <h1>Activate account confirmation</h1>
        </div>
        <div className={styles['style-notify-activate']}>
            Your account has been activated. Please <Link to={LOGIN_PATH}>click here to login</Link>
        </div>
      </>
    )
}
export default NotifyActivate