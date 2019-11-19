import React, { useState, useEffect } from "react";
import Axios from "axios";
import storage from "local-storage";

import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";

const LoginScreen = props => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(false);

  const submitLogin = data => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      Axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, data)
        .then(user => {
          storage.set("user-id", user.data.id);
          storage.set("user-type", user.data.user_type);
          storage.set("user-name", user.data.username);
          storage.set("user-token", user.data.token);

          setTimeout(resolve((window.location.href = "/home")), 3000);
        })
        .catch(err => {
          setLoading(false);
          setError(true);
          console.log(err);
        });
    });
  };

  return (
    <div style={{ flex: 1 }}>
      <div>
        <div style={{ textAlign: "center" }}>
          <h5 className="text-center pt-5">Login Form</h5>

          <Form className="mt-5 mb-5">
            <FormGroup>
              <Label className="text-left">
                Username:{" "}
                <Input
                  type="text"
                  name="user_name"
                  placeholder="Input Your Username"
                  value={Username}
                  onChange={event => setUsername(event.target.value)}
                ></Input>
              </Label>
            </FormGroup>
            <FormGroup>
              <Label className="text-left">
                Password:
                <Input
                  type="password"
                  name="user_password"
                  placeholder="Input Your Password"
                  value={Password}
                  onChange={event => setPassword(event.target.value)}
                ></Input>
              </Label>
            </FormGroup>
            {Error ? <Label style={{ color: "red" }}>Username/Password is invalid</Label> : ""}

            <FormGroup>
              <Button
                color="success"
                onClick={() =>
                  submitLogin({
                    user_name: Username,
                    user_password: Password
                  })
                }
              >
                {Loading === true ? <Spinner size="sm" color="primary" /> : "Login"}
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
