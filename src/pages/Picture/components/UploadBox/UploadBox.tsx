import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import React, { ChangeEvent } from "react";
import "./UploadBox.scss";
import { useRef } from "react";
import { Tooltip } from "antd";

interface Props {
  previewImage?: string;
  imageName?: string;
  isDuplicateName: boolean;
  handleSetImage: Function;
  handleSetCustomName: Function;
  handleSetPreviewImage: Function;
  handleSetImageName: Function;
}

//eslint-disable-next-line
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

const UploadBox = ({
  previewImage,
  imageName,
  isDuplicateName,
  handleSetImage,
  handleSetCustomName,
  handleSetPreviewImage,
  handleSetImageName,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSetImage(e.target.files[0]);
      handleSetPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
    if (e.target.value) {
      const value = e.target.value.match(regExp);
      if (value) handleSetImageName(value[0]);
    }
  };

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    handleSetCustomName(e.target.value);
  };

  const handleRemoveImage = () => {
    handleSetPreviewImage(undefined);
    handleSetImage(undefined);

    handleSetImageName(undefined);
    handleSetCustomName(undefined);
  };

  return (
    <div className="UBContainer">
      <div className={previewImage ? "UBWrapper active" : "UBWrapper"}>
        <div className="UBImage">
          {previewImage ? <img src={previewImage} alt="" /> : null}
        </div>
        <div className="UBContent">
          <div className="UBIcon">
            <CloudUploadOutlined />
          </div>
          <div className="UBText">No image chosen, yet!</div>
        </div>
        <div id="UBCancelButton" onClick={handleRemoveImage}>
          <CloseCircleOutlined />
        </div>
        <div className="UBFileName">{imageName}</div>
      </div>
      <input
        type="file"
        id="UBDefaultButton"
        hidden
        onChange={handleChangeImage}
        ref={ref}
        accept="image/png, image/jpeg"
      />
      {previewImage ? (
        <div
          className={isDuplicateName ? "InputContainer show" : "InputContainer"}
        >
          <input
            type="text"
            id="UBNameInput"
            onChange={handleChangeText}
            placeholder="Image custom name"
          />
          <Tooltip color="red" title="Duplicate name">
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      ) : null}
      <button
        id="UBCustomButton"
        onClick={() => ref.current?.click()}
        // style={previewImage ? { marginTop: "20px" } : { marginTop: "20px" }}
      >
        Choose a image
      </button>
    </div>
  );
};

export default UploadBox;
