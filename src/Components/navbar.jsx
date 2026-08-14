import { useState } from "react";
import {
  Navbar as ReactNavbar,
  Container,
  Offcanvas,
} from "react-bootstrap";
import "./style2.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/tedxlogo.png"; // ✅ update path to your logo file

function CustomNavbar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleAboutClick = (e) => {
    e.preventDefault();
    setShow(false); // close offcanvas
    navigate("/#testimonials"); // redirect with hash
    setTimeout(() => {
      const el = document.getElementById("testimonials");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <ReactNavbar
      bg="dark"
      variant="dark"
      expand={false}
      fixed="top"
      className="bg-transparent border-0 shadow-none"
    >
      <Container fluid className="p-0 m-0 d-flex align-items-center justify-content-between">

        {/* ✅ Logo on the left */}
        {/* <Link to="/home" onClick={handleClose} className="d-flex align-items-center ms-2"> <img src={logo} alt="TEDxTIET Logo" style={{ height: "45px", width: "auto" }} /></Link> */}

        {/* ✅ Hamburger on the right */}
        <ReactNavbar.Toggle
          onClick={() => setShow(true)}
          className="ms-auto nav-toggle-btn navbtnn"
        />

        <Offcanvas
          show={show}
          onHide={handleClose}
          id="offcanvasDarkNavbar"
          placement="end"
          className="text-bg-dark"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{ fontSize: "3rem", fontWeight: "bold" }}>
              TEDxTIET
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul className="list-unstyled">
              <li>
                <Link className="animated-text" to="/home" onClick={handleClose}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="animated-text" to="/gallery" onClick={handleClose}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link className="animated-text" to="/sponsor" onClick={handleClose}>
                  Sponsor
                </Link>
              </li>
              <li>
                <Link className="animated-text" to="/team" onClick={handleClose}>
                  Team
                </Link>
              </li>
              <li>
                <Link className="animated-text" to="/speakers" onClick={handleClose}>
                  Speakers
                </Link>
              </li>
                <li>
  <Link className="animated-text" to="/alumni" onClick={handleClose}>
    Alumni
  </Link>
</li>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </ReactNavbar>
  );
}

export default CustomNavbar;
