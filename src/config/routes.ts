import NotFound from "@pages/NotFound";
import SignInAndSignUp from "@pages/SignInAndSignUp";
import React from "react";

const Picture = React.lazy(() => import("../pages/Picture"));
const Video = React.lazy(() => import("../pages/Video"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Home = React.lazy(() => import("../pages/Home"));

export const privateRoutes = [
  {
    path: "/",
    exact: true,
    component: Home,
    title: "Home",
  },
  {
    path: "/pictures",
    exact: true,
    component: Picture,
    title: "Picture",
  },
  {
    path: "/videos",
    exact: true,
    component: Video,
    title: "Video",
  },
  {
    path: "/profile",
    exact: true,
    component: Profile,
    title: "Profile",
  },
];

export const publicRoutes = [
  {
    path: "/sign-in",
    exact: true,
    component: SignInAndSignUp,
    title: "Sign In",
  },
  {
    path: "/notfound",
    exact: true,
    component: NotFound,
    title: "Not Found",
  },
];

const routes = [...privateRoutes, ...publicRoutes];

export default routes;
