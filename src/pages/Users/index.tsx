
import UsersFilter from "./UsersFilter";
import UsersTable from "./UsersTable";
import styles from './index.module.css'

const Users = () => {
  return (
    <div className={styles["wrapper"]}>
      <UsersFilter />
      <UsersTable />
    </div>
  );
};

export default Users;
