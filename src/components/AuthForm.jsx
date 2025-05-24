// src/components/AuthForm.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only used for registration
  });

  const { email, password, name } = formData;

  useEffect(() => {
    if (auth.isAuthenticated) {
      // Navigate to "/" after successful login or registration
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(registerUser({ email, password, name }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          {auth.error && (
            <Alert variant="danger">{auth.error.message || auth.error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {isRegister && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={auth.loading}>
              {auth.loading
                ? "Please wait..."
                : isRegister
                ? "Register"
                : "Login"}
            </Button>
          </Form>
          <hr />
          <div>
            <Button
              variant="link"
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
