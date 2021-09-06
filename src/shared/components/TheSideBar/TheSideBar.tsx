import {
  CameraOutlined,
  CaretLeftFilled,
  GlobalOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
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
        <span></span>
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
            <Link to="/">
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
    </div>
  );
};

export default TheSideBar;
