import React from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { connect } from "react-redux";
import { setUserState } from "../../slices/user.slice";
import routes from "../../../config/routes";
import { Button, Dropdown, Menu, PageHeader, Row, Typography } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import "./TheLayout.scss";
import { AppDispatch, RootState } from "../../../config/store";
import { resetSignInState } from "../../../components/SignIn/SignIn.slice";
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import logo from "../../../assets/image/main_logo.png";

interface Props {
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  dispatch: AppDispatch;
}

const TheLayout = ({ photoURL, displayName, email, dispatch }: Props) => {
  const history = useHistory();
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
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
        history.push("/sign-in");
        dispatch(resetSignInState());
      }
    });
    return () => {
      setShouldRender(false);
      unsubscribe();
    };
  }, [history, dispatch]);

  const handleLogout = async () => {
    await auth.signOut();
  };

  const menu = (
    <Menu>
      {displayName || email ? (
        <Menu.Item key={0}>
          <Row justify="center" align="middle">
            <Typography.Title level={5} style={{ margin: 0 }}>
              {displayName ? displayName : email ? email : ""}
            </Typography.Title>
          </Row>
        </Menu.Item>
      ) : (
        <></>
      )}
      <Menu.Item key={1}>
        <Link to="/profile">
          <Row gutter={24} align="middle">
            <ProfileOutlined
              style={{ marginLeft: "10px", verticalAlign: "baseline" }}
            />
            <Button
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                boxShadow: "none",
              }}
            >
              Profile
            </Button>
          </Row>
        </Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Row gutter={24} align="middle" onClick={handleLogout}>
          <LogoutOutlined
            style={{ marginLeft: "10px", verticalAlign: "baseline" }}
          />
          <Button
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
              boxShadow: "none",
            }}
          >
            Log out
          </Button>
        </Row>
      </Menu.Item>
    </Menu>
  );

  return shouldRender ? (
    <div className="layoutContainer">
      <div className="headerWrapper">
        <PageHeader
          title={
            <div className="header">
              <img className="headerLogo" src={logo} alt=""></img>
              <Typography.Title level={1} id="logoText">
                icify
              </Typography.Title>
            </div>
          }
          extra={[
            <div className="extraHeader" key="1">
              <Dropdown
                overlay={menu}
                placement="bottomCenter"
                arrow
                trigger={["click"]}
              >
                <Avatar
                  size="large"
                  src={photoURL}
                  icon={<UserOutlined />}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </div>,
          ]}
        />
      </div>
      <div className="contentWrapper">
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    </div>
  ) : (
    <></>
  );
};

const mapState = ({ user }: RootState) => ({
  photoURL: user.photoURL,
  displayName: user.displayName,
  email: user.email,
});

export default connect(mapState)(TheLayout);
