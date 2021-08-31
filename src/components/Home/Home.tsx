import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "../../config/store";
import AddPictureModal from "./components/AddPictureModal/AddPictureModal";
import "./Home.scss";

interface Props {
  dispatch: AppDispatch;
}

const Home = ({ dispatch }: Props) => {
  const [openAddPictureModal, setOpenAddPictureModal] =
    useState<boolean>(false);

  return (
    <div className="homeContainer">
      <div className="actionWrapper">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={() => setOpenAddPictureModal(true)}
        ></Button>
      </div>
      <div className="imageArea">
        <div className="imageCard">
          <img
            src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
            alt=""
          />
          <div className="imageCardFooter">
            <button>Get link</button>
            <button>Download</button>
          </div>
        </div>
        <div className="imageCard">
          <img
            src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
            alt=""
          />
          <div className="imageCardFooter">
            <button>Get link</button>
            <button>Download</button>
          </div>
        </div>
        <div className="imageCard">
          <img
            src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
            alt=""
          />
          <div className="imageCardFooter">
            <button>Get link</button>
            <button>Download</button>
          </div>
        </div>
        <div className="imageCard">
          <img
            src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
            alt=""
          />
          <div className="imageCardFooter">
            <button>Get link</button>
            <button>Download</button>
          </div>
        </div>
        <div className="imageCard">
          <img
            src="https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
            alt=""
          />
          <div className="imageCardFooter">
            <button>Get link</button>
            <button>Download</button>
          </div>
        </div>
      </div>
      <AddPictureModal
        open={openAddPictureModal}
        handleCancel={() => setOpenAddPictureModal(false)}
      />
    </div>
  );
};

const mapState = () => ({});

export default connect(mapState)(Home);
