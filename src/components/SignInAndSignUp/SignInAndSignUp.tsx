import React, { FormEvent, ReactElement, useState } from "react";
import "./SignInAndSignUp.scss";
import loginLogo from "../../assets/image/login_logo.svg";
import {
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
} from "@firebase/auth";
import { auth } from "../../config/firebase";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { codeToString } from "../../utils/string";

interface Props {}

function SignInAndSignUp(props: Props): ReactElement {
  const [loginInErrorMessage, setLoginInErrorMessage] = useState<string>();
  const [loginUpErrorMessage, setLoginUpErrorMessage] = useState<string>();
  const [loginInLoading, setLoginInLoading] = useState<boolean>(false);
  const [loginUpLoading, setLoginUpLoading] = useState<boolean>(false);

  const history = useHistory();

  const loginInRef = useRef<HTMLFormElement>(null);
  const loginUpRef = useRef<HTMLFormElement>(null);

  const loginInEmailRef = useRef<HTMLInputElement>(null);
  const loginInPasswordRef = useRef<HTMLInputElement>(null);

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
      loginUpEmailRef.current &&
      loginUpPasswordRef.current &&
      loginUpConfirmPasswordRef.current
    ) {
      if (value === "signIn") {
        loginInEmailRef.current.value = "";
        loginInPasswordRef.current.value = "";
      } else if (value === "signUp") {
        loginUpEmailRef.current.value = "";
        loginUpPasswordRef.current.value = "";
        loginUpConfirmPasswordRef.current.value = "";
      } else {
        loginInEmailRef.current.value = "";
        loginInPasswordRef.current.value = "";
        loginUpEmailRef.current.value = "";
        loginUpPasswordRef.current.value = "";
        loginUpConfirmPasswordRef.current.value = "";
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
        history.push("/");
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
      loginUpEmailRef.current &&
      loginUpPasswordRef.current &&
      loginUpConfirmPasswordRef.current
    ) {
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
        </div>

        <div className="login__forms">
          <form
            action=""
            className="login__registre"
            id="login-in"
            ref={loginInRef}
            onSubmit={handleSignIn}
          >
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
                type="password"
                placeholder="Password"
                className="login__input"
                required
                ref={loginInPasswordRef}
              />
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
          </form>

          <form
            action=""
            className="login__create none"
            id="login-up"
            ref={loginUpRef}
            onSubmit={handleSignUp}
          >
            <h1 className="login__title">Create Account</h1>

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
                type="password"
                placeholder="Password"
                className="login__input"
                required
                ref={loginUpPasswordRef}
              />
            </div>

            <div className="login__box">
              <LockOutlined className="login__icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="login__input"
                required
                ref={loginUpConfirmPasswordRef}
              />
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

            <div className="login__social">
              <button className="login__social-icon">
                <FacebookFilled />
              </button>
              <button className="login__social-icon google">
                <GoogleCircleFilled />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInAndSignUp;
