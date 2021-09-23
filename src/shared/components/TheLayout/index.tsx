import React, { Suspense } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Switch, useHistory } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { connect } from "react-redux";
import { setUserState } from "../../slices/user.slice";
import { privateRoutes } from "../../../config/routes";
import { PageHeader, Spin, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import "./styles.scss";
import { AppDispatch, RootState } from "../../../config/store";
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import TheSideBar from "../TheSideBar";
import MenuDropDown from "../MenuDropDown";

interface Props {
  photoURL: string | null;
  dispatch: AppDispatch;
}

const TheLayout = ({ photoURL, dispatch }: Props) => {
  const history = useHistory();
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    if (
      privateRoutes.findIndex(
        (route) => route.path === history.location.pathname,
      ) > -1
    ) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          dispatch(
            setUserState({
              accessToken: token,
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
              uid: user.uid,
            }),
          );
          setShouldRender(true);
        } else {
          setShouldRender(false);
          history.push("/sign-in", { from: history.location });
        }
      });
      return () => {
        setShouldRender(false);
        unsubscribe();
      };
    } else {
      history.push("/notfound");
    }
  }, [history, dispatch]);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return shouldRender ? (
    <div className="layoutContainer">
      <div className="sideBarWrapper">
        <TheSideBar />
      </div>
      <div className="sideWrapper">
        <div className="headerWrapper">
          <PageHeader
            title={
              <div className="header">
                <img className="headerLogo" src="main_logo.png" alt=""></img>
                <Typography.Title level={1} id="logoText">
                  icify
                </Typography.Title>
              </div>
            }
            extra={[
              <div className="extraHeader" key="1">
                <MenuDropDown
                  elements={[
                    {
                      name: "Profile",
                      icon: <ProfileOutlined />,
                      to: "/profile",
                    },
                    {
                      name: "Logout",
                      icon: <LogoutOutlined />,
                      click: handleLogout,
                    },
                  ]}
                >
                  <Avatar
                    size="large"
                    src={photoURL}
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer", margin: 0 }}
                  />
                </MenuDropDown>
              </div>,
            ]}
          />
        </div>
        <div className="contentWrapper">
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2rem 0",
                }}
              >
                <Spin size="large" />
              </div>
            }
          >
            <Switch>
              {privateRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              ))}
            </Switch>
          </Suspense>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

const mapState = ({ user }: RootState) => ({
  photoURL: user.photoURL,
});

export default connect(mapState)(TheLayout);
