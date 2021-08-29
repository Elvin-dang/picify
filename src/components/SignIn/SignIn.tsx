import { Alert, Button, Col, Form, Input, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppDispatch, RootState } from "../../config/store";
import "./SignIn.scss";
import { signInAsyncAction } from "./SignIn.slice";

interface Props {
  error: string;
  loading: boolean;
  signInSuccess: boolean;
  dispatch: AppDispatch;
}

const SignIn = ({ error, loading, signInSuccess, dispatch }: Props) => {
  const history = useHistory();

  useEffect(() => {
    if (signInSuccess) history.push("/");
  }, [history, signInSuccess]);

  const handleSubmit = async (value: any) => {
    dispatch(signInAsyncAction({ ...value }));
  };

  return (
    <div className="signInContainer">
      <Row justify="center" align="middle">
        <Typography.Title>Sign In</Typography.Title>
      </Row>
      <Form
        onFinish={handleSubmit}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
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
        {error ? (
          <Row>
            <Col span={16} offset={8}>
              <Alert
                style={{ marginBottom: "24px", color: "red" }}
                type="error"
                message="Username or password is invalid"
                showIcon
              />
            </Col>
          </Row>
        ) : (
          <></>
        )}
        <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapState = ({ signIn }: RootState) => ({
  error: signIn.error,
  loading: signIn.loading,
  signInSuccess: signIn.signInSuccess,
});

export default connect(mapState)(SignIn);
