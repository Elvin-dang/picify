import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import { AppDispatch, RootState } from "../../config/store";
import { UserState } from "../../shared/slices/user.slice";
import { getPictureAsyncAction, PictureState } from "../Picture/Picture.slice";
import Spinner from "../../shared/components/Spinner";

interface Props {
  user: UserState;
  picture: PictureState;
  dispatch: AppDispatch;
}

const Profile = ({ user, picture, dispatch }: Props) => {
  useEffect(() => {
    dispatch(getPictureAsyncAction(user.uid));
  }, [dispatch, user.uid]);

  const pictureUsagePercentage = () => {
    let total = 0;
    picture.pictures.forEach((picture) => (total += picture.size));
    return total / Math.pow(1024, 2);
  };

  return (
    <div className="profileContainer">
      <div className="header">
        <img src="background.jpg" alt="" />
      </div>
      <div className="content">
        <div className="avatar">
          <img src="avatar.png" alt="" />
        </div>
        <div className="information">
          <div className="wrapper">
            <h2>{user.displayName}</h2>
            <h3>{user.email}</h3>
          </div>
          <div className="tag">Free</div>
        </div>
      </div>
      {picture.fetchingPicture ? (
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
            <div className="box video">
              <div className="title">Video</div>
              <div className="number">0</div>
              <div className="progress">0MB</div>
            </div>
          </div>
          <div className="action">
            <button>Upgrade</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(({ user, picture }: RootState) => ({
  user,
  picture,
}))(Profile);