import styles from "./login.module.css";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <LoginForm />
    </div>
  );
};

export default Login;
