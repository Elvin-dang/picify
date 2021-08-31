import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Skeleton } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../config/store";
import AddPictureModal from "./components/AddPictureModal/AddPictureModal";
import "./Home.scss";
import { getPictureAsyncAction } from "./Home.slice";

interface Props {
  uid: string;
  pictures: string[];
  fetchingPicture: boolean;
  dispatch: AppDispatch;
}

const Home = ({ uid, pictures, fetchingPicture, dispatch }: Props) => {
  const [openAddPictureModal, setOpenAddPictureModal] =
    useState<boolean>(false);

  useEffect(() => {
    dispatch(getPictureAsyncAction(uid));
  }, [dispatch, uid]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    message.success("Copied !!");
  };

  return (
    <div className="homeContainer">
      <div className="actionWrapper">
        {fetchingPicture ? (
          <Skeleton.Button shape="circle" active />
        ) : (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => setOpenAddPictureModal(true)}
          ></Button>
        )}
      </div>
      <div className="imageArea">
        {fetchingPicture ? (
          <>
            <div className="imageCard">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
          </>
        ) : (
          pictures.map((picture, index) => (
            <div className="imageCard" key={index}>
              <img src={picture} alt="" />
              <div className="imageCardFooter">
                <button onClick={() => copyToClipboard(picture)}>
                  Get link
                </button>
                <button>Download</button>
              </div>
            </div>
          ))
        )}
      </div>
      <AddPictureModal
        open={openAddPictureModal}
        handleCancel={() => setOpenAddPictureModal(false)}
      />
    </div>
  );
};

const mapState = ({ home, user }: RootState) => ({
  uid: user.uid,
  pictures: home.pictures,
  fetchingPicture: home.fetchingPicture,
});

export default connect(mapState)(Home);
