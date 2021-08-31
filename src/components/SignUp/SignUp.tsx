import { Alert, Button, Col, Form, Input, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppDispatch, RootState } from "../../config/store";
import { resetSignInState } from "../SignIn/SignIn.slice";
import "./SignUp.scss";
import { setSignUpState, signUpAsyncAction } from "./SignUp.slice";

interface Props {
  error: string;
  loading: boolean;
  signUpSuccess: boolean;
  dispatch: AppDispatch;
}

const SignUp = ({ error, loading, signUpSuccess, dispatch }: Props) => {
  const history = useHistory();

  useEffect(() => {
    if (signUpSuccess) history.push("/");
  }, [history, signUpSuccess]);

  const handleSubmit = async (value: any) => {
    if (value.password !== value.confirmPassword) {
      dispatch(setSignUpState({ error: "confirm password does not match" }));
    } else dispatch(signUpAsyncAction({ ...value }));
  };

  return (
    <div className="signUpContainer">
      <div className="signUpCard">
        <Row justify="center" align="middle">
          <Typography.Title>Sign Up</Typography.Title>
        </Row>
        <Form
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          requiredMark={false}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please input confirm password" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {error ? (
            <Row>
              <Col span={16} offset={8}>
                <Alert
                  style={{ marginBottom: "24px", color: "red" }}
                  type="error"
                  message={`Sign up fail: ${error}`}
                  showIcon
                />
              </Col>
            </Row>
          ) : (
            <></>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
            <Button
              type="text"
              onClick={() => {
                dispatch(resetSignInState());
                history.push("/sign-in");
              }}
            >
              Go to sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapState = ({ signUp }: RootState) => ({
  error: signUp.error,
  loading: signUp.loading,
  signUpSuccess: signUp.signUpSuccess,
});

export default connect(mapState)(SignUp);
