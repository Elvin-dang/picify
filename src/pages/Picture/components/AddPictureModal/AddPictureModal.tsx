import {
  CloseOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { message, Progress } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../../../config/store";
import ConfirmModal from "../../../../shared/components/ConfirmModal/ConfirmModal";
import { addPictureAsyncAction, PicturesType } from "../../Picture.slice";
import UploadBox from "../UploadBox/UploadBox";
import "./AddPictureModal.scss";

interface Props {
  uid: string;
  open: boolean;
  uploadingPicture: string;
  uploadProgress: number;
  pictures: PicturesType[];
  handleCancel: () => void;
  dispatch: AppDispatch;
}

const AddPictureModal = ({
  uid,
  open,
  uploadingPicture,
  uploadProgress,
  pictures,
  handleCancel,
  dispatch,
}: Props) => {
  const [image, setImage] = useState<File>();
  const [customName, setCustomName] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [imageName, setImageName] = useState<string>();
  const [openWaringModal, setOpenWarningModel] = useState<boolean>(false);
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  useEffect(() => {
    if (uploadingPicture === "complete") {
      setImage(undefined);
      setCustomName(undefined);
      setIsDuplicateName(false);
      setPreviewImage(undefined);
      setImageName(undefined);
      handleCancel();
    }
  }, [uploadingPicture, handleCancel]);

  const handleSetImage = (image: File) => setImage(image);
  const handleSetCustomName = (value: string) => {
    setCustomName(value);
    if (pictures.findIndex((picture) => picture.name === value) > -1) {
      setIsDuplicateName(true);
    } else {
      setIsDuplicateName(false);
    }
  };
  const handleSetPreviewImage = (value: string) => setPreviewImage(value);
  const handleSetImageName = (value: string) => setImageName(value);

  const handleUpload = () => {
    if (image && (image.type === "image/jpeg" || image.type === "image/png")) {
      if (image.size <= 10 * Math.pow(1024, 2)) {
        if (
          pictures.findIndex((picture) =>
            customName
              ? picture.name === customName
              : picture.name === image.name,
          ) > -1
        ) {
          setOpenWarningModel(true);
        } else {
          dispatch(addPictureAsyncAction({ uid, image, customName }));
        }
      } else {
        message.error("Image size must be smaller than 10MB");
      }
    } else {
      message.error("File must be image (jpg/png)");
      setImage(undefined);
      setPreviewImage(undefined);
    }
  };

  const forceUpload = () => {
    dispatch(addPictureAsyncAction({ uid, image, customName }));
    setOpenWarningModel(false);
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
            isDuplicateName={isDuplicateName}
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
        <ConfirmModal
          open={openWaringModal}
          onCancel={() => setOpenWarningModel(false)}
          content={"Image has been duplicate name. Are you sure to continue ?"}
          moreInfo={
            "Keep uploading will overwrite the picture which has the same name"
          }
          confirmButton={<button onClick={forceUpload}>Accept</button>}
          icon={<WarningOutlined />}
        />
      </div>
    </Modal>
  );
};

const mapState = ({ user, picture }: RootState) => ({
  uid: user.uid,
  uploadingPicture: picture.uploadingPicture,
  uploadProgress: picture.uploadProgress,
  pictures: picture.pictures,
});

export default connect(mapState)(AddPictureModal);
