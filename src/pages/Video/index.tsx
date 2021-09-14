import {
  DownloadOutlined,
  LinkOutlined,
  PlayCircleFilled,
  PlaySquareFilled,
  RollbackOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "@config/store";
import { Empty, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import { getVideoAsyncAction, VideoType } from "./Video.slice";
import { kontext } from "./kontext";
import { toTimeString } from "@utils/time";

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
  const ref = useRef<HTMLDivElement>(null);
  const contextRef = useRef<any>(null);

  useEffect(() => {
    dispatch(getVideoAsyncAction(uid));
  }, [dispatch, uid]);

  useEffect(() => {
    if (ref.current) {
      contextRef.current = kontext(ref.current);
    }
  }, []);

  return (
    <div className="videoContainer" ref={ref}>
      <div className="layer one show">
        <div className="actionWrapper">
          {fetchingVideo ? (
            <Skeleton.Button active />
          ) : (
            <>
              <button
                className="push"
                onClick={() => setOpenAddVideoModal(true)}
              >
                <VideoCameraAddOutlined /> Push
              </button>
            </>
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
            videos.map((video, index) => (
              <div className="videoCard" key={video.name}>
                <video src={video.url}></video>
                <div className="videoThumbnail">
                  <PlayCircleFilled
                    onClick={() => {
                      contextRef.current.show(1);
                    }}
                  />
                </div>
                <div className="videoCardFooter">
                  <div className="name">{video.name}</div>
                  <div className="descriptionWrapper">
                    <div className="create">{toTimeString(video.createAt)}</div>
                    <div className="duration">04:50</div>
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
      <div className="layer two">
        <div className="videoContentWrapper">
          <div className="videoContent">
            {videos.length > 0 ? (
              <video src={videos[0].url} controls></video>
            ) : undefined}
          </div>
          <div className="videoInfo">
            <div className="action">
              <div className="back">
                <RollbackOutlined
                  onClick={() => {
                    contextRef.current.show(0);
                  }}
                />
              </div>
              <div className="das">
                <LinkOutlined />
                <DownloadOutlined />
              </div>
            </div>
            <div className="info">
              <div className="title">
                <PlaySquareFilled />
                Title
              </div>
              <div className="detail">
                <div className="label">Name</div>
                <div className="text">Name</div>
              </div>
              <div className="detail">
                <div className="label">Size</div>
                <div className="text">3.5MB</div>
              </div>
              <div className="detail">
                <div className="label">Type</div>
                <div className="text">video/mp4</div>
              </div>
              <div className="detail">
                <div className="label">Create</div>
                <div className="text">12/12/2021</div>
              </div>
              <div className="detail">
                <div className="label">Description</div>
                <div className="text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                  iste a necessitatibus deleniti odio nesciunt tempore in facere
                  doloribus sint. Natus labore, aliquid quisquam ea ad modi
                  repudiandae recusandae odit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
