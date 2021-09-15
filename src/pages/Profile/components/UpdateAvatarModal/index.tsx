import {
  AreaChartOutlined,
  ArrowLeftOutlined,
  CameraOutlined,
  CloudUploadOutlined,
  ContainerOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Empty, message, Tooltip } from "antd";
import React, {
  ChangeEvent,
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../../../config/store";
import ConfirmModal from "../../../../shared/components/ConfirmModal";
import { PictureType } from "../../../Picture/Picture.slice";
import "./styles.scss";
import { auth, storage } from "../../../../config/firebase";
import { updateProfile } from "@firebase/auth";
import { setUserState } from "../../../../shared/slices/user.slice";

const line: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const img: CSSProperties = {
  width: "30px",
  height: "30px",
  objectFit: "cover",
  overflow: "hidden",
  marginRight: "5px",
};

interface Props {
  photoURL: string | null;
  openEditAvatarModal: boolean;
  pictures: PictureType[];
  uid: string;
  onCancel: () => void;
  dispatch: AppDispatch;
}

const UpdateAvatarModal = ({
  photoURL,
  openEditAvatarModal,
  pictures,
  uid,
  onCancel,
  dispatch,
}: Props) => {
  const [newAvatar, setNewAvatar] = useState<string | File | null>(photoURL);
  const [previewImage, setPreviewImage] = useState<string>();
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<{ name: "a" | "b" | "d"; step: number }>(
    {
      name: "d",
      step: 1,
    },
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openEditAvatarModal) {
      setNewAvatar(photoURL);
      setPreviewImage(undefined);
      setSelectedIndex(undefined);
      setOption({
        name: "d",
        step: 1,
      });
    }
  }, [openEditAvatarModal, photoURL]);

  const getOption = (name: "a" | "b" | "d", step: number) => {
    switch (name) {
      case "a":
        switch (step) {
          case 1:
            return (
              <div className="optionGroup" key="a1">
                <input
                  type="file"
                  hidden
                  onChange={handleChangeImage}
                  ref={inputRef}
                  accept="image/png, image/jpeg"
                />
                <div
                  className="optionItem"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadOutlined /> Upload avatar
                </div>
                <div
                  className="optionItem"
                  onClick={() => setOption({ name: "a", step: 2 })}
                >
                  <ContainerOutlined /> Choose avatar in gallery
                </div>
                <div
                  className={newAvatar ? "optionItem" : "optionItem disabled"}
                  onClick={handleDelete}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  <DeleteOutlined /> Delete Avatar
                </div>
              </div>
            );
          case 2:
            return (
              <div className="optionGroup" key="a2">
                <div className="imageContainer">
                  {pictures.length > 0 ? (
                    pictures.map((picture, index) => (
                      <div
                        className="image"
                        key={picture.name}
                        onClick={() => {
                          setSelectedIndex(index);
                          setNewAvatar(picture.url);
                          setPreviewImage(undefined);
                        }}
                      >
                        <img
                          src={picture.url}
                          alt=""
                          className={
                            selectedIndex === index ? "selected" : undefined
                          }
                        ></img>
                      </div>
                    ))
                  ) : (
                    <Empty description="No picture to choose" />
                  )}
                </div>
              </div>
            );
          default:
            return undefined;
        }
      case "b":
        break;
      case "d":
        return (
          <div className="optionGroup" key="d">
            <div
              className="optionItem"
              onClick={() => setOption({ name: "a", step: 1 })}
            >
              <CameraOutlined /> Avatar
            </div>
            <div
              className="optionItem disabled"
              onClick={() => setOption({ name: "b", step: 1 })}
            >
              <AreaChartOutlined /> Background
            </div>
          </div>
        );
      default:
        return undefined;
    }
  };

  const handleBack = () => {
    setOption({
      name: option.step === 1 ? "d" : option.name,
      step: option.step === 1 ? 1 : option.step - 1,
    });
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setSelectedIndex(undefined);
    }
  };

  const handleDelete = () => {
    setNewAvatar(null);
    setPreviewImage(undefined);
    setSelectedIndex(undefined);
  };

  const handleUpdateAvatar = async () => {
    try {
      setLoading(true);
      if (newAvatar instanceof File) {
        if (
          newAvatar &&
          (newAvatar.type === "image/jpeg" || newAvatar.type === "image/png")
        ) {
          if (newAvatar.size <= 10 * Math.pow(1024, 2)) {
            const imageRef = ref(storage, `${uid}/personal/avatar`);
            const snapshot = await uploadBytes(imageRef, newAvatar);
            const url = await getDownloadURL(snapshot.ref);

            if (auth.currentUser) {
              await updateProfile(auth.currentUser, {
                photoURL: url,
              });
              dispatch(setUserState({ photoURL: url }));
            }
          } else {
            message.error("Image size must be smaller than 10MB");
            return;
          }
        } else {
          message.error("File must be image (jpg/png)");
          setNewAvatar(null);
          setPreviewImage(undefined);
          return;
        }
      } else {
        if (auth.currentUser) {
          if (newAvatar) {
            // from gallery
            const image = await fetch(newAvatar);
            const imageBlog = await image.blob();

            const imageRef = ref(storage, `${uid}/personal/avatar`);
            const snapshot = await uploadBytes(imageRef, imageBlog);
            const url = await getDownloadURL(snapshot.ref);

            await updateProfile(auth.currentUser, {
              photoURL: url,
            });
            dispatch(setUserState({ photoURL: url }));
          } else {
            // null
            await updateProfile(auth.currentUser, {
              photoURL: "",
            });
            dispatch(setUserState({ photoURL: newAvatar }));
          }
        }
      }
      setLoading(false);
      message.success("Update avatar/background success");
      onCancel();
    } catch (err) {
      setLoading(false);
      message.error("Fail to update avatar/background");
    }
  };

  return (
    <ConfirmModal
      open={openEditAvatarModal}
      onCancel={onCancel}
      width={600}
      confirmButton={
        <button onClick={handleUpdateAvatar}>
          {loading ? <LoadingOutlined /> : <CloudUploadOutlined />} Update
        </button>
      }
    >
      <div className="updateAvatarModalContainer">
        <div className="backAction">
          <ArrowLeftOutlined
            className={option.name === "d" ? "disable" : undefined}
            onClick={handleBack}
          />
          <Tooltip
            title={
              <div className="tooltipTitle">
                <div className="line" style={{ ...line, marginBottom: "10px" }}>
                  <img src="background.jpg" alt="" style={img} />
                  Default background
                </div>
                <div className="line" style={line}>
                  <img src="avatar.png" alt="" style={img} />
                  Default avatar
                </div>
              </div>
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        </div>
        <div className="header">
          <img src="background.jpg" alt="" />
          <div className="avatar">
            <img
              src={
                newAvatar
                  ? newAvatar instanceof File
                    ? previewImage
                    : newAvatar
                  : "avatar.png"
              }
              alt=""
            />
          </div>
        </div>
        <div className="body">{getOption(option.name, option.step)}</div>
      </div>
    </ConfirmModal>
  );
};

const mapState = ({ user, picture }: RootState) => ({
  photoURL: user.photoURL,
  uid: user.uid,
  pictures: picture.pictures,
});

export default connect(mapState)(UpdateAvatarModal);
