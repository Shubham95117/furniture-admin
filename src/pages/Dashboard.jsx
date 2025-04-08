// src/pages/Dashboard.js
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <AdminNavbar />
        <div className="container-fluid p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
