import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaMapMarkedAlt } from "react-icons/fa"; // map icon for brand

function Header() {
  return (
    <header>
      <Navbar
        expand="lg"
        sticky="top"
        variant="dark"
        style={{
          background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: "0.8rem 1rem",
          transition: "all 0.3s ease",
        }}
      >
        <Container>
          <Navbar.Brand
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              fontSize: "22px",
              color: "white",
            }}
          >
            <FaMapMarkedAlt style={{ marginRight: "8px", fontSize: "28px" }} />
            GeoFence
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbar-nav"
            style={{ borderColor: "white" }}
          />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                href="/"
                style={{
                  color: "white",
                  marginLeft: "20px",
                  fontWeight: 500,
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#FFD700";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Home
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
