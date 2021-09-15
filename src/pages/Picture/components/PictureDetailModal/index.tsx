import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import React from "react";
import "./styles.scss";
import { useRef } from "react";
import { PictureType } from "../../Picture.slice";

interface Props {
  open: boolean;
  handleCancel: () => void;
  picture?: PictureType;
  handleNextPicture: () => void;
  handlePreviousPicture: () => void;
}

const PictureDetailModal = ({
  open,
  handleCancel,
  handleNextPicture,
  handlePreviousPicture,
  picture,
}: Props) => {
  const ref = useRef<HTMLImageElement>(null);

  const contentOnMouseMove = (e: React.MouseEvent) => {
    const xAxis = (window.innerWidth / 2 - e.clientX) / 10;
    const yAxis = (window.innerHeight / 2 - e.clientY) / 10;
    if (ref.current) {
      ref.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
  };

  const contentOnMouseEnter = () => {
    if (ref.current) {
      ref.current.style.transition = "none";
    }
  };

  const contentOnMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transition = "all 0.5s ease";
      ref.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    }
  };

  return (
    <div
      className={open ? "PDContainer" : "PDContainer close"}
      onClick={handleCancel}
    >
      <div className="PDPrevious">
        <LeftCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            handlePreviousPicture();
          }}
        />
      </div>
      <div
        className="PDContent"
        onMouseMove={contentOnMouseMove}
        onMouseLeave={contentOnMouseLeave}
        onMouseEnter={contentOnMouseEnter}
      >
        <img
          src={picture?.url}
          alt=""
          onClick={(e) => e.stopPropagation()}
          ref={ref}
        />
      </div>
      <div className="PDNext">
        <RightCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            handleNextPicture();
          }}
        />
      </div>
    </div>
  );
};

export default PictureDetailModal;
