import { PlusOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from "@config/store";
import { Button, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import { getVideoAsyncAction, VideoType } from "./Video.slice";
import { kontext } from "./kontext";

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
  const bulletRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    dispatch(getVideoAsyncAction(uid));
  }, [dispatch, uid]);

  useEffect(() => {
    if (ref.current && bulletRef.current) {
      const k = kontext(ref.current);

      for (var i = 0, len = k.getTotal(); i < len; i++) {
        var bullet = document.createElement("li");
        bullet.className = i === 0 ? "active" : "";
        bullet.setAttribute("index", i.toString());
        bullet.onclick = function (event: any) {
          k.show(event.target?.getAttribute("index"));
        };
        bullet.ontouchstart = function (event: any) {
          k.show(event.target?.getAttribute("index"));
        };
        bulletRef.current.appendChild(bullet);
      }

      k.changed.add(function (layer: any, index: any) {
        var bullets = document.body.querySelectorAll(".bullets li");
        for (var i = 0, len = bullets.length; i < len; i++) {
          bullets[i].className = i === index ? "active" : "";
        }
      });
    }
  }, []);

  return (
    <div className="videoContainer" ref={ref}>
      <div className="layer one show">
        <div className="actionWrapper">
          {fetchingVideo ? (
            <Skeleton.Button shape="circle" active />
          ) : (
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => setOpenAddVideoModal(true)}
              style={{
                transition:
                  "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), visibility 0s",
              }}
            ></Button>
          )}
        </div>
      </div>
      <div className="layer two">
        <div className="videoArea">
          <div className="videoContent">
            {videos.length > 0 ? (
              <video src={videos[0].url} controls></video>
            ) : undefined}
          </div>
          <div className="videoInfo">
            <div>
              <div className="Name">
                LolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLolLol
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className="bullets" ref={bulletRef}></ul>
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
