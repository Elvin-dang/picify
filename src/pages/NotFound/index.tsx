import React from "react";
import { useHistory } from "react-router";
import "./styles.scss";

interface Props {}

const NotFound = (props: Props) => {
  const history = useHistory();

  return (
    <div className="notfoundContainer">
      <div className="cardContainer">
        <img src="404.png" alt="" />
        <h1 className="title">404 Not Found</h1>
        <div className="description">
          You lost your way, but don't worry we can help you to get back
        </div>
        <button onClick={() => history.push("/")}>Back to home</button>
      </div>
    </div>
  );
};

export default NotFound;
