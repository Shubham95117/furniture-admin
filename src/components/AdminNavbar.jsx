// src/components/AdminNavbar.js
import React from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const AdminNavbar = () => {
  const handleLogout = () => {
    // Implement logout action here
    console.log("Logging out...");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Admin Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <div className="ms-auto d-flex align-items-center">
            {/* Search Bar */}

            {/* Notifications Dropdown */}
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaBell size={20} />
                <Badge bg="danger" pill className="ms-1">
                  3
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Notification 1</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Notification 2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Notification 3</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Logout Button */}
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
