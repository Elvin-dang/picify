import {
  CameraFilled,
  FireFilled,
  TeamOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import React from "react";
import { useHistory } from "react-router";
import "./styles.scss";

interface Props {}

const Home = (props: Props) => {
  const history = useHistory();

  return (
    <div className="homeContainer">
      <h1 className="title">
        Explore <span>picify</span> now
      </h1>
      <p className="description">
        Store, share, and collaborate on picture and video from any mobile
        device, tablet, or computer
      </p>
      <button className="showMe" onClick={() => history.push("/profile")}>
        Show Me
      </button>
      <div className="cardArea">
        <div className="card">
          <div className="imgBox">
            <img src="collection.svg" alt="" />
          </div>
          <div className="content">
            <h2>Cloud Storage</h2>
            <p>
              Free to store your personal image and video within 3 easy steps.
            </p>
          </div>
          <div className="action one">
            <button onClick={() => history.push("/pictures")}>
              <CameraFilled /> Picture
            </button>
            <button onClick={() => history.push("/videos")}>
              <VideoCameraFilled /> Video
            </button>
          </div>
        </div>
        <div className="card">
          <div className="imgBox">
            <img src="scale.svg" alt="" />
          </div>
          <div className="content">
            <h2>Easy Scale Up</h2>
            <p>Expand your gallery by registering an premium account.</p>
          </div>
          <div className="action two">
            <button>
              <FireFilled /> Premium
            </button>
          </div>
        </div>
        <div className="card">
          <div className="imgBox">
            <img src="social.svg" alt="" />
          </div>
          <div className="content">
            <h2>Social Contact</h2>
            <p>
              You can share your pictures and videos in our social, the more
              contact the more friends you get.
            </p>
          </div>
          <div className="action three">
            <button>
              <TeamOutlined /> Join social
            </button>
          </div>
        </div>
      </div>
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>
      <div className="wave wave3"></div>
      <div className="wave wave4"></div>
    </div>
  );
};

export default Home;
