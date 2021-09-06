import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import "./reset.scss";
import "antd/dist/antd.css";
import { store } from "./config/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
