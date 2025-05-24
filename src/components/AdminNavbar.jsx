// src/components/AdminNavbar.js
import React from "react";
import { Navbar, Container, Dropdown } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    console.log("Logging out...");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          {user && user.displayName ? user.displayName : "Admin Panel"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav" className="justify-content-end">
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-profile">
              <CgProfile size={40} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item as={Link} to="/settings">
                Settings
              </Dropdown.Item> */}
              {/* <Dropdown.Divider /> */}
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
