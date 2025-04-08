// src/components/AdminNavbar.js
import React, { useState } from "react";
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
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement your search action here
    console.log("Searching for:", search);
  };

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
            <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                placeholder="Search..."
                className="me-2"
                aria-label="Search"
                value={search}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>

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
