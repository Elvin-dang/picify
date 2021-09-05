import React, { CSSProperties, ReactNode } from "react";
import "./ConfirmModal.scss";
import { Modal } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  styles?: CSSProperties;
  confirmButton?: ReactNode;
  content: ReactNode;
  moreInfo?: ReactNode;
  theme?: string;
  icon?: ReactNode;
}

const ConfirmModal = ({
  open,
  onCancel,
  styles,
  confirmButton,
  content,
  moreInfo,
  theme,
  icon,
}: Props) => {
  return (
    <Modal
      style={{ ...styles }}
      visible={open}
      onCancel={onCancel}
      closable={false}
      footer={null}
      width={400}
    >
      <div
        className="CMContainer"
        style={theme ? { ["--main-theme" as any]: theme } : undefined}
      >
        {icon ? <div className="icon">{icon}</div> : null}
        <div className="content">{content}</div>
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
