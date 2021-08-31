import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import UploadBox from "../UploadBox/UploadBox";
import "./AddPictureModal.scss";

interface Props {
  open: boolean;
  handleCancel: () => void;
}

const AddPictureModal = ({ open, handleCancel }: Props) => {
  const [image, setImage] = useState<File>();

  const handleSetImage = (image: File) => setImage(image);

  return (
    <Modal
      visible={open}
      onCancel={handleCancel}
      closable={false}
      footer={null}
    >
      <div className="addPictureModalContainer">
        <div className="addPictureModalUploadBox">
          <UploadBox handleSetImage={handleSetImage} />
        </div>
      </div>
    </Modal>
  );
};

export default AddPictureModal;
