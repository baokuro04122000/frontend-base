import { Row, Col, Button } from 'antd';
import AssignRole from "./AssignRole";
import AssignRoleStatus from "./AssignRoleStatus";
import styles from './index.module.css'
const EditRole = () => {
  return (
    <>
      <Row className={styles['wrapper']}>
        <Col span={15}>
          <AssignRole/>
        </Col>
        <Col span={9}>
          <AssignRoleStatus/>
        </Col>
      </Row>
      <Row>
        <div style={{width:"100%", textAlign:"right"}}>
          <Button>Return to list</Button>
          <Button>Save</Button>
        </div>
      </Row>
    </>
  );
};

export default EditRole;
