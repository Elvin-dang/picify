import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import React, { ChangeEvent, LegacyRef } from "react";
import "./styles.scss";
import { useRef } from "react";
import { Tooltip } from "antd";

interface Props {
  previewVideo?: string;
  videoName?: string;
  isDuplicateName: boolean;
  handleSetVideo: Function;
  handleSetCustomName: Function;
  handleSetDescription: Function;
  handleSetPreviewVideo: Function;
  handleSetVideoName: Function;
  videoRef: LegacyRef<HTMLVideoElement>;
}

//eslint-disable-next-line
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

const UploadBox = ({
  previewVideo,
  videoName,
  isDuplicateName,
  handleSetVideo,
  handleSetCustomName,
  handleSetDescription,
  handleSetPreviewVideo,
  handleSetVideoName,
  videoRef,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChangeVideo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSetVideo(e.target.files[0]);
      handleSetPreviewVideo(URL.createObjectURL(e.target.files[0]));
    }
    if (e.target.value) {
      const value = e.target.value.match(regExp);
      if (value) handleSetVideoName(value[0]);
    }
  };

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    handleSetCustomName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleSetDescription(e.target.value);
  };

  const handleRemoveVideo = () => {
    if (ref.current) ref.current.value = "";
    handleSetPreviewVideo(undefined);
    handleSetVideo(undefined);
    handleSetVideoName(undefined);
    handleSetCustomName(undefined);
    handleSetDescription(undefined);
  };

  return (
    <div className="UBContainer">
      <div className={previewVideo ? "UBWrapper active" : "UBWrapper"}>
        <div className="UBVideo">
          {previewVideo ? (
            <video src={previewVideo} controls ref={videoRef} />
          ) : null}
        </div>
        <div className="UBContent">
          <div className="UBIcon">
            <CloudUploadOutlined />
          </div>
          <div className="UBText">No video chosen, yet!</div>
        </div>
        <div id="UBCancelButton" onClick={handleRemoveVideo}>
          <CloseCircleOutlined />
        </div>
        <div className="UBFileName">{videoName}</div>
      </div>
      <input
        type="file"
        id="UBDefaultButton"
        hidden
        onChange={handleChangeVideo}
        ref={ref}
        accept="video/mp4,video/x-m4v,video/*"
      />
      {previewVideo ? (
        <>
          <div
            className={
              isDuplicateName ? "InputContainer show" : "InputContainer"
            }
          >
            <input
              type="text"
              id="UBNameInput"
              onChange={handleChangeText}
              placeholder="Video custom name"
            />
            <Tooltip color="red" title="Duplicate name">
              <InfoCircleOutlined />
            </Tooltip>
            <textarea
              id="UBDescriptionInput"
              rows={5}
              placeholder="Video description"
              onChange={handleChangeDescription}
            />
          </div>
        </>
      ) : null}
      <button id="UBCustomButton" onClick={() => ref.current?.click()}>
        Choose a video
      </button>
    </div>
  );
};

export default UploadBox;
