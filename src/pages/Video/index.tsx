import {
  DeleteFilled,
  DeleteOutlined,
  DownloadOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlayCircleFilled,
  PlaySquareFilled,
  RollbackOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@config/store";
import { Empty, message, Skeleton } from "antd";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import {
  deleteVideoAsyncAction,
  getVideoAsyncAction,
  VideoType,
} from "./Video.slice";
import { kontext } from "./kontext";
import { toDurationString, toTimeString } from "@utils/time";
import { byteToString } from "@utils/string";
import AddVideoModal from "./components/AddVideoModal";
import ConfirmModal from "@shared/components/ConfirmModal";
import { useRefHeight } from "@shared/customHooks";

interface Props {
  uid: string;
  videos: VideoType[];
  fetchingVideo: boolean;
  deletingVideo: "none" | "deleting" | "complete";
  dispatch: AppDispatch;
}

const Video = ({
  dispatch,
  uid,
  videos,
  fetchingVideo,
  deletingVideo,
}: Props) => {
  const [openAddVideoModal, setOpenAddVideoModal] = useState<boolean>(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType>();

  const ref = useRef<HTMLDivElement>(null);
  const layerOne = useRef<HTMLDivElement>(null);
  const layerTwo = useRef<HTMLDivElement>(null);
  const contextRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [layerTuple, setLayerTuple] = useState<
    (RefObject<HTMLDivElement> | undefined)[]
  >([layerOne, undefined]);
  const dynamicHeight = useRefHeight(20, layerTuple[0], layerTuple[1]);

  useEffect(() => {
    dispatch(getVideoAsyncAction(uid));
  }, [dispatch, uid]);

  useEffect(() => {
    if (deletingVideo === "complete") {
      setSelectedVideo(undefined);
      setOpenDeleteConfirmModal(false);
    }
  }, [deletingVideo]);

  useEffect(() => {
    if (ref.current) {
      contextRef.current = kontext(ref.current);
    }
  }, []);

  const copyToClipboard = (value?: string) => {
    navigator.clipboard.writeText(value ? value : "");
    message.success("Copied !!");
  };

  const downloadVideo = async (video?: VideoType) => {
    if (video) {
      const item = await fetch(video.url);
      const itemBlog = await item.blob();
      const itemURL = URL.createObjectURL(itemBlog);

      const link = document.createElement("a");
      link.href = itemURL;
      link.download = video.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.error("Download Video Fail");
    }
  };

  return (
    <div className="videoContainer" ref={ref} style={{ height: dynamicHeight }}>
      <div className="layer one show" ref={layerOne}>
        <div className="actionWrapper">
          {fetchingVideo ? (
            <Skeleton.Button active />
          ) : (
            <button className="push" onClick={() => setOpenAddVideoModal(true)}>
              <VideoCameraAddOutlined /> Add
            </button>
          )}
        </div>
        <div className="videoArea">
          {fetchingVideo ? (
            <>
              <div className="videoCard skeleton">
                <Skeleton.Image />
                <div className="videoCardFooter">
                  <Skeleton.Input active />
                  <div className="descriptionWrapper">
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                  </div>
                </div>
              </div>
              <div className="videoCard skeleton">
                <Skeleton.Image />
                <div className="videoCardFooter">
                  <Skeleton.Input active />
                  <div className="descriptionWrapper">
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                  </div>
                </div>
              </div>
              <div className="videoCard skeleton">
                <Skeleton.Image />
                <div className="videoCardFooter">
                  <Skeleton.Input active />
                  <div className="descriptionWrapper">
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                  </div>
                </div>
              </div>
              <div className="videoCard skeleton">
                <Skeleton.Image />
                <div className="videoCardFooter">
                  <Skeleton.Input active />
                  <div className="descriptionWrapper">
                    <Skeleton.Input active />
                    <Skeleton.Input active />
                  </div>
                </div>
              </div>
            </>
          ) : videos.length > 0 ? (
            videos.map((video) => (
              <div className="videoCard" key={video.name}>
                <video src={video.url}></video>
                <div className="videoThumbnail">
                  <PlayCircleFilled
                    onClick={() => {
                      contextRef.current.show(1);
                      setLayerTuple([layerTwo, layerOne]);
                      setSelectedVideo(video);
                    }}
                  />
                </div>
                <button className="delete">
                  <DeleteFilled
                    onClick={() => {
                      setSelectedVideo(video);
                      setOpenDeleteConfirmModal(true);
                    }}
                  />
                </button>
                <div className="videoCardFooter">
                  <div className="name">{video.name}</div>
                  <div className="descriptionWrapper">
                    <div className="create">{toTimeString(video.createAt)}</div>
                    <div className="duration">
                      {toDurationString(video.duration)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                description={
                  <div className="emptyDescription">No video in gallery</div>
                }
              />
            </div>
          )}
        </div>
      </div>
      <div className="layer two" ref={layerTwo}>
        <div className="videoContentWrapper">
          <div className="videoContent">
            {videos.length > 0 ? (
              <video src={selectedVideo?.url} controls ref={videoRef}></video>
            ) : undefined}
          </div>
          <div className="videoInfo">
            <div className="action">
              <div className="back">
                <RollbackOutlined
                  onClick={() => {
                    contextRef.current.show(0);
                    setLayerTuple([layerOne, layerTwo]);
                    if (videoRef.current) {
                      videoRef.current.pause();
                    }
                  }}
                />
              </div>
              <div className="das">
                <LinkOutlined
                  onClick={() => copyToClipboard(selectedVideo?.url)}
                />
                <DownloadOutlined
                  onClick={() => downloadVideo(selectedVideo)}
                />
              </div>
            </div>
            <div className="info">
              <div className="title">
                <PlaySquareFilled />
                {selectedVideo?.name}
              </div>
              <div className="detail">
                <div className="label">Name</div>
                <div className="text">{selectedVideo?.name}</div>
              </div>
              <div className="detail">
                <div className="label">Size</div>
                <div className="text">{byteToString(selectedVideo?.size)}</div>
              </div>
              <div className="detail">
                <div className="label">Type</div>
                <div className="text">{selectedVideo?.contentType}</div>
              </div>
              <div className="detail">
                <div className="label">Create</div>
                <div className="text">
                  {toTimeString(selectedVideo?.createAt)}
                </div>
              </div>
              <div className="detail">
                <div className="label">Description</div>
                <div className="text">
                  {selectedVideo?.description !== "" ? (
                    selectedVideo?.description
                  ) : (
                    <span style={{ color: "orange" }}>None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVideoModal
        open={openAddVideoModal}
        handleCancel={() => setOpenAddVideoModal(false)}
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
                deleteVideoAsyncAction({
                  uid,
                  videoName: selectedVideo ? selectedVideo.name : undefined,
                }),
              )
            }
          >
            {deletingVideo === "deleting" ? (
              <LoadingOutlined />
            ) : (
              <DeleteOutlined />
            )}{" "}
            Delete
          </button>
        }
      >
        Are you sure to delete "{selectedVideo ? selectedVideo.name : undefined}
        " ?
      </ConfirmModal>
    </div>
  );
};

const mapState = ({ video, user }: RootState) => ({
  uid: user.uid,
  videos: video.videos,
  fetchingVideo: video.fetchingVideo,
  deletingVideo: video.deletingVideo,
});

export default connect(mapState)(Video);
