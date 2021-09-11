import React, { CSSProperties, ReactNode } from "react";
import "./styles.scss";
import { Modal } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  styles?: CSSProperties;
  confirmButton?: ReactNode;
  moreInfo?: ReactNode;
  theme?: string;
  icon?: ReactNode;
  children: ReactNode;
  width?: number;
}

const ConfirmModal = ({
  open,
  onCancel,
  styles,
  confirmButton,
  moreInfo,
  theme,
  icon,
  children,
  width,
}: Props) => {
  return (
    <Modal
      style={{ ...styles }}
      visible={open}
      onCancel={onCancel}
      closable={false}
      footer={null}
      width={width ? width : 400}
    >
      <div
        className="CMContainer"
        style={theme ? { ["--main-theme" as any]: theme } : undefined}
      >
        {icon ? <div className="icon">{icon}</div> : null}
        <div className="content">{children}</div>
        {moreInfo ? <div className="moreInfo">{moreInfo}</div> : null}
        <div className="action">
          {confirmButton ? (
            <div className="customBtn">{confirmButton}</div>
          ) : null}
          <div className="cancelBtn">
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
