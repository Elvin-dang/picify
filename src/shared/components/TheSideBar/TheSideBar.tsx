import {
  CameraOutlined,
  CaretDownOutlined,
  CaretLeftFilled,
  GlobalOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../../config/store";
import { useWindowSize } from "../../customHooks";
import "./TheSideBar.scss";

interface Props {
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
}

const TheSideBar = ({ photoURL, displayName, email }: Props) => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [width] = useWindowSize();
  const location = useLocation();

  let checkPath = (path: string) => {
    if (location.pathname === path) return "active";
    return undefined;
  };

  const toggleSideBar = () => setIsCollapse(!isCollapse);

  return (
    <div
      className={isCollapse || width <= 768 ? "sideBar collapse" : "sideBar"}
    >
      <div className="topBar">
        {isCollapse || width <= 768 ? (
          <Avatar
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            src={photoURL}
          >
            {displayName?.charAt(0).toLocaleUpperCase()}
          </Avatar>
        ) : (
          <span>
            <h3>{displayName}</h3>
            <div>{email}</div>
          </span>
        )}
        <CaretLeftFilled
          className="sideBarBtn"
          onClick={toggleSideBar}
          style={
            width <= 768 ? { pointerEvents: "none", opacity: "0.5" } : undefined
          }
        />
      </div>
      <div className="logoGroup">
        <Link to="/" className="logoIcon">
          <img src="/main_logo.png" alt="" />
        </Link>
        <Link to="/" className="logo">
          <img src="/main_logo.png" alt="" />
          <Typography.Title level={1} id="logoText">
            icify
          </Typography.Title>
        </Link>
      </div>
      <div className="menu">
        <ul>
          <li>
            <Link to="/pictures" className={checkPath("/pictures")}>
              <CameraOutlined className="icon" />
              <span className="text">Picture</span>
            </Link>
          </li>
          <li>
            <Link to="/videos" className={checkPath("/videos")}>
              <VideoCameraOutlined className="icon" />
              <span className="text">Video</span>
            </Link>
          </li>
          <li>
            <Link to="/social" className={checkPath("/social")}>
              <GlobalOutlined className="icon" />
              <span className="text">Social</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="messageGroup">
        <div className="title">
          <h4>Setting</h4>
        </div>
        <div className="messages">
          <ul>
            <li>
              <span className="userThumb">
                <img
                  src="https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60"
                  alt=""
                />
              </span>
              <span className="userName">Meow</span>
            </li>
            <li>
              <span className="userThumb">
                <img
                  src="https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9nfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60"
                  alt=""
                />
              </span>
              <span className="userName">Gow</span>
            </li>
            <li>
              <span className="userThumb">
                <img
                  src="https://images.unsplash.com/photo-1512544783971-fb9a0691eda5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29sZnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60"
                  alt=""
                />
              </span>
              <span className="userName">Awl</span>
            </li>
          </ul>
          <CaretDownOutlined className="viewAll" />
        </div>
      </div>
    </div>
  );
};

const mapState = ({ user }: RootState) => ({
  photoURL: user.photoURL,
  displayName: user.displayName,
  email: user.email,
});

export default connect(mapState)(TheSideBar);
