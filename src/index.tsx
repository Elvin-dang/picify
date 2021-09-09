import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import "antd/dist/antd.css";
import "./reset.scss";
import { store } from "./config/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
