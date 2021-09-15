import { WarningOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from "@config/store";
import { VideoType } from "@pages/Video/Video.slice";
import ConfirmModal from "@shared/components/ConfirmModal";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import UploadBox from "../UploadBox";
import "./styles.scss";

interface Props {
  uid: string;
  open: boolean;
  uploadingVideo: string;
  uploadProgress: number;
  videos: VideoType[];
  handleCancel: () => void;
  dispatch: AppDispatch;
}

const AddVideoModal = ({
  uid,
  open,
  uploadingVideo,
  uploadProgress,
  videos,
  handleCancel,
  dispatch,
}: Props) => {
  const [video, setVideo] = useState<File>();
  const [customName, setCustomName] = useState<string>();
  const [previewVideo, setPreviewVideo] = useState<string>();
  const [videoName, setVideoName] = useState<string>();
  const [openWaringModal, setOpenWarningModel] = useState<boolean>(false);
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  useEffect(() => {
    if (uploadingVideo === "complete") {
      setVideo(undefined);
      setCustomName(undefined);
      setIsDuplicateName(false);
      setPreviewVideo(undefined);
      setVideoName(undefined);
      handleCancel();
    }
  }, [uploadingVideo, handleCancel]);

  const handleSetVideo = (video: File) => setVideo(video);
  const handleSetCustomName = (value: string) => {
    setCustomName(value);
    if (videos.findIndex((video) => video.name === value) > -1) {
      setIsDuplicateName(true);
    } else {
      setIsDuplicateName(false);
    }
  };
  const handleSetPreviewVideo = (value: string) => setPreviewVideo(value);
  const handleSetVideoName = (value: string) => setVideoName(value);

  const handleUpload = () => {
    if (video && (video.type === "video/jpeg" || video.type === "video/png")) {
      if (video.size <= 50 * Math.pow(1024, 2)) {
        if (
          videos.findIndex((video) =>
            customName ? video.name === customName : video.name === video.name,
          ) > -1
        ) {
          setOpenWarningModel(true);
        } else {
          // dispatch(addPictureAsyncAction({ uid, video, customName }));
        }
      } else {
        message.error("Video size must be smaller than 50MB");
      }
    } else {
      message.error("File must be video (mp4, x-m4v)");
      setVideo(undefined);
      setPreviewVideo(undefined);
    }
  };

  const forceUpload = () => {
    // dispatch(addPictureAsyncAction({ uid, video, customName }));
    setOpenWarningModel(false);
  };

  return (
    <Modal
      style={{ top: 50 }}
      visible={open}
      onCancel={uploadingVideo === "uploading" ? undefined : handleCancel}
      closable={false}
      footer={null}
    >
      <div className="addVideoModalContainer">
        <div className="addVideoModalUploadBox">
          <UploadBox
            previewVideo={previewVideo}
            videoName={videoName}
            isDuplicateName={isDuplicateName}
            handleSetVideo={handleSetVideo}
            handleSetCustomName={handleSetCustomName}
            handleSetPreviewVideo={handleSetPreviewVideo}
            handleSetVideoName={handleSetVideoName}
          />
        </div>
      </div>
      <ConfirmModal
        open={openWaringModal}
        onCancel={() => setOpenWarningModel(false)}
        moreInfo={
          "Keep uploading will overwrite the picture which has the same name"
        }
        confirmButton={<button onClick={forceUpload}>Accept</button>}
        icon={<WarningOutlined />}
      >
        Video has been duplicate name. Are you sure to continue ?
      </ConfirmModal>
    </Modal>
  );
};

const mapState = ({ user, video }: RootState) => ({
  uid: user.uid,
  uploadingVideo: video.uploadingVideo,
  uploadProgress: video.uploadProgress,
  videos: video.videos,
});

export default connect(mapState)(AddVideoModal);
