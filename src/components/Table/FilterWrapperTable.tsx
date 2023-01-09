import { FC, ReactElement } from "react";
import styles from './filter.module.css'
interface Props {
  children?: ReactElement;
  label: string;
}

const FilterWrapperTable: FC<Props> = ({ label, children }) => {
  return (
    <div style={{display: "block", width:"100%", minHeight:"10vh"}}>
      <div style={{
        position:"fixed", 
        width: "83.1%", 
        zIndex: "1000",
        minHeight: "10vh",
        background: "rgb(240 242 245)"
      }}>
        <h3 className={styles['title-filter']}>{label}</h3>
        <div     
        > 
            {children}
        </div>
      </div>
    </div>
  );
};

export default FilterWrapperTable;
