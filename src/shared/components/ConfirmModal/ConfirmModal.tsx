import React, { CSSProperties } from "react";
import "ConfirmModal.scss";
import { Modal } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  styles: CSSProperties;
}

const ConfirmModal = ({ open, onCancel, styles }: Props) => {
  return (
    <Modal
      style={{ ...styles, borderRadius: "30px" }}
      visible={open}
      onCancel={onCancel}
      closable={false}
      footer={null}
    ></Modal>
  );
};

export default ConfirmModal;
