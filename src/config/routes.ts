import React from "react";

const Picture = React.lazy(() => import("../pages/Picture"));
const Profile = React.lazy(() => import("../pages/Profile"));

const routes = [
  {
    path: "/pictures",
    exact: true,
    component: Picture,
  },
  {
    path: "/profile",
    exact: true,
    component: Profile,
  },
];

export default routes;
