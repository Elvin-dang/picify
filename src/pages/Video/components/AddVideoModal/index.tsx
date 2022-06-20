import {
  CloseOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@config/store";
import { addVideoAsyncAction, VideoType } from "@pages/Video/Video.slice";
import ConfirmModal from "@shared/components/ConfirmModal";
import { message, Modal, Progress } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
  const [description, setDescription] = useState<string>();
  const [previewVideo, setPreviewVideo] = useState<string>();
  const [videoName, setVideoName] = useState<string>();
  const [openWaringModal, setOpenWarningModel] = useState<boolean>(false);
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (uploadingVideo === "complete") {
      setVideo(undefined);
      setCustomName(undefined);
      setDescription(undefined);
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
  const handleSetDescription = (value: string) => setDescription(value);
  const handleSetPreviewVideo = (value: string) => setPreviewVideo(value);
  const handleSetVideoName = (value: string) => setVideoName(value);

  const handleUpload = () => {
    if (video && (video.type === "video/mp4" || video.type === "video/x-m4v")) {
      if (video.size <= 100 * Math.pow(1024, 2)) {
        if (
          videos.findIndex((videoItem) =>
            customName
              ? videoItem.name === customName
              : videoItem.name === video.name,
          ) > -1
        ) {
          setOpenWarningModel(true);
        } else {
          dispatch(
            addVideoAsyncAction({
              uid,
              video,
              customName,
              description,
              duration: videoRef.current?.duration,
            }),
          );
        }
      } else {
        message.error("Video size must be smaller than 100MB");
      }
    } else {
      message.error("File must be video (mp4, x-m4v)");
      setVideo(undefined);
      setPreviewVideo(undefined);
    }
  };

  const forceUpload = () => {
    dispatch(
      addVideoAsyncAction({
        uid,
        video,
        customName,
        description,
        duration: videoRef.current?.duration,
      }),
    );
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
            handleSetDescription={handleSetDescription}
            handleSetPreviewVideo={handleSetPreviewVideo}
            handleSetVideoName={handleSetVideoName}
            videoRef={videoRef}
          />
        </div>
        <div className="addVideoModalActionArea">
          {uploadingVideo === "uploading" ? (
            <Progress
              status={uploadProgress === 100 ? undefined : "active"}
              percent={uploadProgress}
            />
          ) : (
            <>
              <button
                id="uploadBtn"
                onClick={handleUpload}
                disabled={video ? false : true}
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
          moreInfo={
            "Keep uploading will overwrite the video which has the same name"
          }
          confirmButton={<button onClick={forceUpload}>Accept</button>}
          icon={<WarningOutlined />}
        >
          Video has been duplicate name. Are you sure to continue ?
        </ConfirmModal>
      </div>
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
