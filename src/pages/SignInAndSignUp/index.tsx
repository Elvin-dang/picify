import React, { FormEvent, ReactElement, useState } from "react";
import "./styles.scss";
import loginLogo from "../../assets/image/login_logo.svg";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FacebookFilled,
  GoogleCircleFilled,
  LoadingOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "@firebase/auth";
import { auth } from "../../config/firebase";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { codeToString } from "../../utils/string";
import logo from "../../assets/image/main_logo.png";

interface Props {}

function SignInAndSignUp(props: Props): ReactElement {
  const [loginInErrorMessage, setLoginInErrorMessage] = useState<string>();
  const [loginUpErrorMessage, setLoginUpErrorMessage] = useState<string>();
  const [loginInLoading, setLoginInLoading] = useState<boolean>(false);
  const [loginUpLoading, setLoginUpLoading] = useState<boolean>(false);
  const [loginInShowPassword, setLoginInShowPassword] =
    useState<boolean>(false);
  const [loginUpShowPassword, setLoginUpShowPassword] =
    useState<boolean>(false);

  const history = useHistory();
  const { from } =
    history.location.state || ({ from: { pathname: "/" } } as any);

  const loginInRef = useRef<HTMLFormElement>(null);
  const loginUpRef = useRef<HTMLFormElement>(null);

  const loginInEmailRef = useRef<HTMLInputElement>(null);
  const loginInPasswordRef = useRef<HTMLInputElement>(null);

  const loginUpDisplayNameRef = useRef<HTMLInputElement>(null);
  const loginUpEmailRef = useRef<HTMLInputElement>(null);
  const loginUpPasswordRef = useRef<HTMLInputElement>(null);
  const loginUpConfirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    if (loginInRef.current && loginUpRef.current) {
      if (value === "signUp") {
        loginInRef.current.classList.remove("block");
        loginUpRef.current.classList.remove("none");

        loginInRef.current.classList.toggle("none");
        loginUpRef.current.classList.toggle("block");
      }
      if (value === "signIn") {
        loginInRef.current.classList.remove("none");
        loginUpRef.current.classList.remove("block");

        loginInRef.current.classList.toggle("block");
        loginUpRef.current.classList.toggle("none");
      }
    }
  };

  const resetData = (value?: string) => {
    if (
      loginInEmailRef.current &&
      loginInPasswordRef.current &&
      loginUpDisplayNameRef.current &&
      loginUpEmailRef.current &&
      loginUpPasswordRef.current &&
      loginUpConfirmPasswordRef.current
    ) {
      if (value === "signIn") {
        loginInEmailRef.current.value = "";
        loginInPasswordRef.current.value = "";
        setLoginInShowPassword(false);
      } else if (value === "signUp") {
        loginUpDisplayNameRef.current.value = "";
        loginUpEmailRef.current.value = "";
        loginUpPasswordRef.current.value = "";
        loginUpConfirmPasswordRef.current.value = "";
        setLoginUpShowPassword(false);
      } else {
        loginInEmailRef.current.value = "";
        loginInPasswordRef.current.value = "";
        loginUpDisplayNameRef.current.value = "";
        loginUpEmailRef.current.value = "";
        loginUpPasswordRef.current.value = "";
        loginUpConfirmPasswordRef.current.value = "";
        setLoginInShowPassword(false);
        setLoginUpShowPassword(false);
      }
    }
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginInEmailRef.current && loginInPasswordRef.current) {
      // Email check
      if (
        !loginInEmailRef.current.value.match(
          // eslint-disable-next-line
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        )
      ) {
        setLoginInErrorMessage("First field must be an email");
        setTimeout(() => setLoginInErrorMessage(undefined), 10000);
        return;
      }

      try {
        setLoginInLoading(true);
        await signInWithEmailAndPassword(
          auth,
          loginInEmailRef.current.value,
          loginInPasswordRef.current.value,
        );
        history.replace(from);
      } catch (err: any) {
        setLoginInLoading(false);
        setLoginInErrorMessage(codeToString(err.code.split("/")[1]));
        setTimeout(() => setLoginInErrorMessage(undefined), 10000);
      }
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      loginUpDisplayNameRef.current &&
      loginUpEmailRef.current &&
      loginUpPasswordRef.current &&
      loginUpConfirmPasswordRef.current
    ) {
      // Display name check
      if (loginUpDisplayNameRef.current.value.length > 30) {
        setLoginUpErrorMessage("Display name must less than 30 characters");
        setTimeout(() => setLoginUpErrorMessage(undefined), 10000);
        return;
      }

      // Email check
      if (
        !loginUpEmailRef.current.value.match(
          // eslint-disable-next-line
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        )
      ) {
        setLoginUpErrorMessage("First field must be an email");
        setTimeout(() => setLoginUpErrorMessage(undefined), 10000);
        return;
      }

      // Confirm password
      if (
        loginUpPasswordRef.current.value !==
        loginUpConfirmPasswordRef.current.value
      ) {
        setLoginUpErrorMessage("Confirm password does not match");
        setTimeout(() => setLoginUpErrorMessage(undefined), 10000);
        return;
      }

      try {
        setLoginUpLoading(true);
        await createUserWithEmailAndPassword(
          auth,
          loginUpEmailRef.current.value,
          loginUpPasswordRef.current.value,
        );
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: loginUpDisplayNameRef.current.value,
          });
        }
        await auth.signOut();
        handleChange("signIn");
        setLoginUpLoading(false);
        resetData();
        message.success("Sign up successfully");
      } catch (err: any) {
        setLoginUpLoading(false);
        setLoginUpErrorMessage(codeToString(err.code.split("/")[1]));
        setTimeout(() => setLoginUpErrorMessage(undefined), 10000);
      }
    }
  };

  return (
    <div className="login">
      <div className="login__content">
        <div className="login__img">
          <img src={loginLogo} alt="" />
          <div className="login__img-hidden">
            <h2 className="login__img-hidden-text">
              Hi, I'm{" "}
              <a
                href="https://www.facebook.com/vinh.dang.3107/"
                target="_blank"
                rel="noreferrer"
              >
                Elvin
              </a>
            </h2>
          </div>
        </div>

        <div className="login__forms">
          <form
            action=""
            className="login__registre"
            id="login-in"
            ref={loginInRef}
            onSubmit={handleSignIn}
          >
            <img className="login__logo" src={logo} alt=""></img>
            <h1 className="login__title">Sign In</h1>

            <div className="login__box">
              <UserOutlined className="login__icon" />
              <input
                type="text"
                placeholder="Email"
                className="login__input"
                required
                ref={loginInEmailRef}
              />
            </div>

            <div className="login__box">
              <LockOutlined className="login__icon" />
              <input
                type={loginInShowPassword ? "text" : "password"}
                placeholder="Password"
                className="login__input"
                required
                ref={loginInPasswordRef}
              />
              {loginInShowPassword ? (
                <EyeInvisibleOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginInShowPassword(false)}
                />
              ) : (
                <EyeOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginInShowPassword(true)}
                />
              )}
            </div>

            <div
              className={
                loginInErrorMessage
                  ? "login__box error show"
                  : "login__box error"
              }
            >
              {loginInErrorMessage}
            </div>

            <button className="login__forgot">Forgot password?</button>

            <div className="login__button-wrapper">
              <button
                className={
                  loginInLoading ? "login__button loading" : "login__button"
                }
                type="submit"
              >
                {loginInLoading ? <LoadingOutlined /> : "Sign In"}
              </button>
            </div>

            <div>
              <span className="login__account">Don't have an Account ?</span>
              <span
                className="login__signin"
                id="sign-up"
                onClick={() => handleChange("signUp")}
              >
                {" Sign Up"}
              </span>
            </div>

            <div className="login__social">
              <button className="login__social-icon">
                <FacebookFilled />
              </button>
              <button className="login__social-icon google">
                <GoogleCircleFilled />
              </button>
            </div>
          </form>

          <form
            action=""
            className="login__create none"
            id="login-up"
            ref={loginUpRef}
            onSubmit={handleSignUp}
          >
            <img className="login__logo" src={logo} alt=""></img>
            <h1 className="login__title">Create Account</h1>

            <div className="login__box">
              <EditOutlined className="login__icon" />
              <input
                type="text"
                placeholder="Display Name"
                className="login__input"
                required
                ref={loginUpDisplayNameRef}
              />
            </div>

            <div className="login__box">
              <UserOutlined className="login__icon" />
              <input
                type="text"
                placeholder="Email"
                className="login__input"
                required
                ref={loginUpEmailRef}
              />
            </div>

            <div className="login__box">
              <LockOutlined className="login__icon" />
              <input
                type={loginUpShowPassword ? "text" : "password"}
                placeholder="Password"
                className="login__input"
                required
                ref={loginUpPasswordRef}
              />
              {loginUpShowPassword ? (
                <EyeInvisibleOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginUpShowPassword(false)}
                />
              ) : (
                <EyeOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginUpShowPassword(true)}
                />
              )}
            </div>

            <div className="login__box">
              <LockOutlined className="login__icon" />
              <input
                type={loginUpShowPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="login__input"
                required
                ref={loginUpConfirmPasswordRef}
              />
              {loginUpShowPassword ? (
                <EyeInvisibleOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginUpShowPassword(false)}
                />
              ) : (
                <EyeOutlined
                  className="login__icon-password"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => setLoginUpShowPassword(true)}
                />
              )}
            </div>

            <div
              className={
                loginUpErrorMessage
                  ? "login__box error show"
                  : "login__box error"
              }
            >
              {loginUpErrorMessage}
            </div>

            <div className="login__button-wrapper">
              <button
                className={
                  loginUpLoading ? "login__button loading" : "login__button"
                }
                type="submit"
              >
                {loginUpLoading ? <LoadingOutlined /> : "Sign Up"}
              </button>
            </div>

            <div>
              <span className="login__account">Already have an Account ?</span>
              <span
                className="login__signup"
                id="sign-in"
                onClick={() => handleChange("signIn")}
              >
                {" Sign In"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInAndSignUp;
