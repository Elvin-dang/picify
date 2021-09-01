import {
  DownloadOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Empty, message, Skeleton } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../config/store";
import AddPictureModal from "./components/AddPictureModal/AddPictureModal";
import "./Home.scss";
import { getPictureAsyncAction, PicturesType } from "./Home.slice";
interface Props {
  uid: string;
  pictures: PicturesType[];
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

  const downloadImage = async (picture: PicturesType) => {
    const image = await fetch(picture.url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = picture.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="imageCard skeleton">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard skeleton">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard skeleton">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
            <div className="imageCard skeleton">
              <Skeleton.Image />
              <div className="imageCardFooter">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
            </div>
          </>
        ) : pictures.length > 0 ? (
          pictures.map((picture, index) => (
            <div className="imageCard" key={index}>
              <img src={picture.url} alt="" />
              <div className="imageCardFooter">
                <button onClick={() => copyToClipboard(picture.url)}>
                  <LinkOutlined />
                </button>
                <button onClick={() => downloadImage(picture)}>
                  <DownloadOutlined />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description="No image in gallery"
            />
          </div>
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
