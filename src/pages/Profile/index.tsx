import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import { AppDispatch, RootState } from "../../config/store";
import { UserState } from "../../shared/slices/user.slice";
import { getPictureAsyncAction, PictureState } from "../Picture/Picture.slice";
import Spinner from "../../shared/components/Spinner";
import { CameraOutlined, FormOutlined } from "@ant-design/icons";
import UpdateProfileModal from "./components/UpdateProfileModal";
import UpdateAvatarModal from "./components/UpdateAvatarModal";
import { getVideoAsyncAction, VideoState } from "@pages/Video/Video.slice";

interface Props {
  user: UserState;
  picture: PictureState;
  video: VideoState;
  dispatch: AppDispatch;
}

const Profile = ({ user, picture, video, dispatch }: Props) => {
  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);
  const [openEditAvatarModal, setOpenEditAvatarModal] =
    useState<boolean>(false);

  useEffect(() => {
    dispatch(getPictureAsyncAction(user.uid));
    dispatch(getVideoAsyncAction(user.uid));
  }, [dispatch, user.uid]);

  const pictureUsagePercentage = () => {
    let total = 0;
    picture.pictures.forEach((picture) => (total += picture.size));
    return total / Math.pow(1024, 2);
  };

  const videoUsagePercentage = () => {
    let total = 0;
    video.videos.forEach((videoItem) => (total += videoItem.size));
    return total / Math.pow(1024, 2);
  };

  return (
    <div className="profileContainer">
      <div className="header">
        <img src="background.jpg" alt="" />
      </div>
      <div className="content">
        <div className="avatar" onClick={() => setOpenEditAvatarModal(true)}>
          <img src={user.photoURL ? user.photoURL : "avatar.png"} alt="" />
          <div className="layer">
            <CameraOutlined />
          </div>
        </div>
        <div className="information">
          <div className="wrapper">
            <h2>
              {user.displayName}
              <div className="group">
                <button
                  className="two"
                  onClick={() => setOpenEditProfileModal(true)}
                >
                  <FormOutlined />
                  <div className="bg"></div>
                </button>
              </div>
            </h2>
            <h3>{user.email}</h3>
          </div>
          <div className="tag">Free</div>
        </div>
      </div>
      {picture.fetchingPicture && video.fetchingVideo ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="usageBox">
            <div className="statistic">
              <div
                className="box image"
                style={
                  {
                    "--progress": `${(pictureUsagePercentage() / 50) * 100}%`,
                  } as any
                }
              >
                <div className="title">Picture</div>
                <div className="number">{picture.pictures.length}</div>
                <div className="progress">
                  {pictureUsagePercentage().toFixed(2)}MB
                </div>
              </div>
              <div
                className="box video"
                style={
                  {
                    "--progress": `${(videoUsagePercentage() / 50) * 100}%`,
                  } as any
                }
              >
                <div className="title">Video</div>
                <div className="number">{video.videos.length}</div>
                <div className="progress">
                  {videoUsagePercentage().toFixed(2)}MB
                </div>
              </div>
            </div>
            <div className="action">
              <button>Upgrade</button>
            </div>
          </div>
        </div>
      )}
      <UpdateProfileModal
        openEditProfileModal={openEditProfileModal}
        onCancel={() => setOpenEditProfileModal(false)}
      />
      <UpdateAvatarModal
        openEditAvatarModal={openEditAvatarModal}
        onCancel={() => setOpenEditAvatarModal(false)}
      />
    </div>
  );
};

export default connect(({ user, picture, video }: RootState) => ({
  user,
  picture,
  video,
}))(Profile);
