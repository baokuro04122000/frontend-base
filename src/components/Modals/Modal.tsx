import { FC, ReactElement } from "react";
import { Modal } from 'antd'

interface Props {
  children?: ReactElement;
  open: boolean;
  title: ReactElement;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  style:React.CSSProperties;
  footer?: ReactElement[]
}
const ModalCreateRole: FC<Props> = ({open, title, onOk, onCancel,okText,style,footer, children}) => {
  return (
    <>
    {open &&
      <Modal
        style={style}
        centered
        visible={open}
        title={title}
        onCancel={onCancel}
        onOk={onOk}
        okText={okText}
        closable={true}
        width={500}
        footer = {footer}
        >
        {children}
      </Modal>
    }
    </>
  );
};

export default ModalCreateRole;
