import {
  CameraOutlined,
  CaretDownOutlined,
  CaretLeftFilled,
  GlobalOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Typography } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TheSideBar.scss";

interface Props {}

const TheSideBar = (props: Props) => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const toggleSideBar = () => setIsCollapse(!isCollapse);

  return (
    <div className={isCollapse ? "sideBar collapse" : "sideBar"}>
      <div className="topBar">
        {isCollapse ? (
          <Avatar style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
            E
          </Avatar>
        ) : (
          <span>Elvin</span>
        )}
        <CaretLeftFilled className="sideBarBtn" onClick={toggleSideBar} />
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
            <Link to="/" className="active">
              <CameraOutlined className="icon" />
              <span className="text">Image</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <VideoCameraOutlined className="icon" />
              <span className="text">Video</span>
            </Link>
          </li>
          <li>
            <Link to="/">
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

export default TheSideBar;
