import React from "react";

const Picture = React.lazy(() => import("../pages/Picture"));
const Video = React.lazy(() => import("../pages/Video"));
const Profile = React.lazy(() => import("../pages/Profile"));

const routes = [
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
