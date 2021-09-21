import React from "react";

const Picture = React.lazy(() => import("../pages/Picture"));
const Video = React.lazy(() => import("../pages/Video"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Home = React.lazy(() => import("../pages/Home"));

const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/pictures",
    exact: true,
    component: Picture,
  },
  {
    path: "/videos",
    exact: true,
    component: Video,
  },
  {
    path: "/profile",
    exact: true,
    component: Profile,
  },
];

export default routes;
