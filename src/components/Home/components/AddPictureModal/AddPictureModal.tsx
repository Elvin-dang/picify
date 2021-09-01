import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Progress } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../../../config/store";
import { addPictureAsyncAction } from "../../Home.slice";
import UploadBox from "../UploadBox/UploadBox";
import "./AddPictureModal.scss";

interface Props {
  uid: string;
  open: boolean;
  uploadingPicture: string;
  uploadProgress: number;
  handleCancel: () => void;
  dispatch: AppDispatch;
}

const AddPictureModal = ({
  uid,
  open,
  uploadingPicture,
  uploadProgress,
  handleCancel,
  dispatch,
}: Props) => {
  const [image, setImage] = useState<File>();
  const [customName, setCustomName] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [imageName, setImageName] = useState<string>();

  useEffect(() => {
    if (uploadingPicture === "complete") {
      setImage(undefined);
      setCustomName(undefined);
      setPreviewImage(undefined);
      setImageName(undefined);
      handleCancel();
    }
  }, [uploadingPicture, handleCancel]);

  const handleSetImage = (image: File) => setImage(image);
  const handleSetCustomName = (value: string) => setCustomName(value);
  const handleSetPreviewImage = (value: string) => setPreviewImage(value);
  const handleSetImageName = (value: string) => setImageName(value);

  const handleUpload = () => {
    if (image && (image.type === "image/jpeg" || image.type === "image/png")) {
      if (image.size <= 10 * Math.pow(1024, 2)) {
        dispatch(addPictureAsyncAction({ uid, image, customName }));
      } else {
        message.error("Image size must be smaller than 10MB");
      }
    } else {
      message.error("File must be image (jpg/png)");
      setImage(undefined);
      setPreviewImage(undefined);
    }
  };

  return (
    <Modal
      style={{ top: 50, borderRadius: "30px" }}
      visible={open}
      onCancel={uploadingPicture === "uploading" ? undefined : handleCancel}
      closable={false}
      footer={null}
    >
      <div className="addPictureModalContainer">
        <div className="addPictureModalUploadBox">
          <UploadBox
            previewImage={previewImage}
            imageName={imageName}
            handleSetImage={handleSetImage}
            handleSetCustomName={handleSetCustomName}
            handleSetPreviewImage={handleSetPreviewImage}
            handleSetImageName={handleSetImageName}
          />
        </div>
        <div className="addPictureModalActionArea">
          {uploadingPicture === "uploading" ? (
            <Progress
              status={uploadProgress === 100 ? undefined : "active"}
              percent={uploadProgress}
            />
          ) : (
            <>
              <button
                id="uploadBtn"
                onClick={handleUpload}
                disabled={image ? false : true}
              >
                <UploadOutlined /> Upload
              </button>
              <button id="cancelBtn" onClick={handleCancel}>
                <CloseOutlined /> Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const mapState = ({ user, home }: RootState) => ({
  uid: user.uid,
  uploadingPicture: home.uploadingPicture,
  uploadProgress: home.uploadProgress,
});

export default connect(mapState)(AddPictureModal);
