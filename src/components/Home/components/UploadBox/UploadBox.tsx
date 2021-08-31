import { CloseCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import React, { ChangeEvent } from "react";
import "./UploadBox.scss";
import { useState } from "react";
import { useRef } from "react";

interface Props {
  handleSetImage: Function;
}

//eslint-disable-next-line
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

const UploadBox = ({ handleSetImage }: Props) => {
  const [previewImage, setPreviewImage] = useState<string>();
  const [imageName, setImageName] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSetImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
    if (e.target.value) {
      const value = e.target.value.match(regExp);
      if (value) setImageName(value[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(undefined);
    handleSetImage(undefined);
    setImageName(undefined);
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
          <div className="UBText">No file chosen, yet!</div>
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
      />
      <button id="UBCustomButton" onClick={() => ref.current?.click()}>
        Choose a file
      </button>
    </div>
  );
};

export default UploadBox;
