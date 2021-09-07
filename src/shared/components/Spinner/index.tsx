import React from "react";
import "./styles.scss";

interface Props {}

const Spinner = (props: Props) => {
  return (
    <div className="customSpinner">
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
    </div>
  );
};

export default Spinner;
