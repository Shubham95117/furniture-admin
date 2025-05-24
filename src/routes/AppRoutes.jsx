// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import ProductForm from "../pages/ProductForm";
import Orders from "../pages/Orders";
import AuthForm from "../components/AuthForm";
import { useSelector } from "react-redux";
// import Profile from "../components/Profile";

// PrivateRoute component that renders children only if the user is authenticated.
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route for authentication */}
      <Route path="/login" element={<AuthForm />} />

      {/* Protected routes: accessible only when the user is logged in */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Products />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />{" "}
        {/* <Route path="profile" element={<Profile />} /> */}
        <Route path="orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
