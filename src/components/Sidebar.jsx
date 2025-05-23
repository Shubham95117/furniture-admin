// src/components/Sidebar.js
import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaBoxes, FaShoppingCart } from "react-icons/fa";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-dark text-light sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isHovered ? "200px" : "60px",
        transition: "width 1.2s ease",
        minHeight: "100vh",
      }}
    >
      <div className="p-3">
        <h4 className="text-center">{isHovered ? "Admin Menu" : "AM"}</h4>
        <hr className="border-light" />
        <Nav defaultActiveKey="/products" className="flex-column">
          <Nav.Link
            as={NavLink}
            to="/products"
            className="d-flex align-items-center text-white"
          >
            <FaBoxes size={20} />
            {isHovered && <span className="ms-2">Products</span>}
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/orders"
            className="d-flex align-items-center text-white"
          >
            <FaShoppingCart size={20} />
            {isHovered && <span className="ms-2">Orders</span>}
          </Nav.Link>
          {/* Add additional navigation items here */}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
