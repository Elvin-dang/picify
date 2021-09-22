import {
  CameraOutlined,
  DeleteFilled,
  DeleteOutlined,
  DownloadOutlined,
  LinkOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Empty, message, Skeleton } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../config/store";
import ConfirmModal from "../../shared/components/ConfirmModal";
import { toTimeString } from "../../utils/time";
import AddPictureModal from "./components/AddPictureModal";
import PictureDetailModal from "./components/PictureDetailModal";
import "./styles.scss";
import {
  deletePictureAsyncAction,
  getPictureAsyncAction,
  PictureType,
} from "./Picture.slice";
interface Props {
  uid: string;
  pictures: PictureType[];
  fetchingPicture: boolean;
  deletingPicture: "none" | "deleting" | "complete";
  dispatch: AppDispatch;
}

const Home = ({
  uid,
  pictures,
  fetchingPicture,
  deletingPicture,
  dispatch,
}: Props) => {
  const [openAddPictureModal, setOpenAddPictureModal] =
    useState<boolean>(false);
  const [openPictureDetailModal, setOpenPictureDetailModal] =
    useState<boolean>(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  useEffect(() => {
    dispatch(getPictureAsyncAction(uid));
  }, [dispatch, uid]);

  useEffect(() => {
    if (deletingPicture === "complete") {
      setSelectedIndex(undefined);
      setOpenDeleteConfirmModal(false);
    }
  }, [deletingPicture]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    message.success("Copied !!");
  };

  const downloadImage = async (picture: PictureType) => {
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

  const handleNextPicture = () => {
    if (selectedIndex !== undefined) {
      if (selectedIndex === pictures.length - 1) setSelectedIndex(0);
      else setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePreviousPicture = () => {
    if (selectedIndex !== undefined) {
      if (selectedIndex === 0) setSelectedIndex(pictures.length - 1);
      else setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="pictureContainer">
      <div className="actionWrapper">
        {fetchingPicture ? (
          <Skeleton.Button active />
        ) : (
          <button className="push" onClick={() => setOpenAddPictureModal(true)}>
            <CameraOutlined /> Add
          </button>
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
            <div className="imageCard" key={picture.name}>
              <img src={picture.url} alt="" />
              <div className="shotThumbnail">
                <div className="magnifying">
                  <SearchOutlined
                    onClick={() => {
                      setSelectedIndex(index);
                      setOpenPictureDetailModal(true);
                    }}
                  />
                </div>
                <div className="shotThumbnailContent">
                  <div className="shotTitle">
                    <div className="shotName">{picture.name}</div>
                    <div className="shotTime">
                      {toTimeString(picture.createAt)}
                    </div>
                  </div>
                  <button
                    className="action"
                    onClick={() => {
                      setSelectedIndex(index);
                      setOpenDeleteConfirmModal(true);
                    }}
                  >
                    <DeleteFilled />
                  </button>
                </div>
              </div>
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
              description={
                <div className="emptyDescription">No image in gallery</div>
              }
            />
          </div>
        )}
      </div>
      <AddPictureModal
        open={openAddPictureModal}
        handleCancel={() => setOpenAddPictureModal(false)}
      />
      <PictureDetailModal
        open={openPictureDetailModal}
        handleCancel={() => setOpenPictureDetailModal(false)}
        picture={
          selectedIndex !== undefined ? pictures[selectedIndex] : undefined
        }
        handleNextPicture={handleNextPicture}
        handlePreviousPicture={handlePreviousPicture}
      />
      <ConfirmModal
        open={openDeleteConfirmModal}
        onCancel={() => setOpenDeleteConfirmModal(false)}
        moreInfo={"Delete perpetually and can not be reverted"}
        theme="red"
        icon={<DeleteOutlined />}
        confirmButton={
          <button
            onClick={() =>
              dispatch(
                deletePictureAsyncAction({
                  uid,
                  imageName:
                    selectedIndex !== undefined
                      ? pictures[selectedIndex].name
                      : undefined,
                }),
              )
            }
          >
            {deletingPicture === "deleting" ? (
              <LoadingOutlined />
            ) : (
              <DeleteOutlined />
            )}{" "}
            Delete
          </button>
        }
      >
        Are you sure to delete "
        {selectedIndex !== undefined ? pictures[selectedIndex].name : undefined}
        " ?
      </ConfirmModal>
    </div>
  );
};

const mapState = ({ picture, user }: RootState) => ({
  uid: user.uid,
  pictures: picture.pictures,
  fetchingPicture: picture.fetchingPicture,
  deletingPicture: picture.deletingPicture,
});

export default connect(mapState)(Home);
