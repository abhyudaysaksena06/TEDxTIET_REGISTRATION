import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      style={{
        background: "black",
        color: "#fff",
        padding: "20px 20px 10px 20px",
        textAlign: "center",
        marginTop: "auto ",
      }}
    >
      <hr style={{ border: "1px solid white" }} />
      <img
        src="/ted_logo.png"
        style={{
          width: "25%",
          alt: "",
          height: "auto",

          margin: "auto",
          alignContent: "center",
          margintop: "30px",
          marginbottom: " 10px",
        }}
      />

      <Link to="/contact" style={{ textDecoration: "none" }}>
        <h3
          style={{
            height: "50px",
            margin: "10px auto 10px auto",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            color: "red",
            border: "2px solid red",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "red";
            e.target.style.color = "white";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "red";
            e.target.style.transform = "scale(1)";
          }}
        >
          CONTACT US
        </h3>

      </Link>
      <div
        style={{
          display: "flex",
          gap: "2%",
          justifyContent: "center",
          alignItems: "center",
          background: "black",
          padding: "10px 20px",
        }}
      >
        <span style={{ fontSize: "28px", marginRight: "20px" }}>
          Find us at:{" "}
        </span>
        <a
          href="https://www.facebook.com/tedxtiet/"
          target="_blank"
          rel="noreferrer"
          className="fa-brands fa-facebook"
          style={{
            color: "white",
            fontSize: "28px",
            marginRight: "20px",
            transition: "color 0.3s",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#1877F2")}
          onMouseOut={(e) => (e.currentTarget.style.color = "white")}
        ></a>
        <a
          href="https://www.instagram.com/tedxtiet/#"
          target="_blank"
          rel="noreferrer"
          className="fa-brands fa-instagram"
          style={{
            color: "white",
            fontSize: "28px",
            transition: "color 0.3s",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = " #D62976 ")}
          onMouseOut={(e) => (e.currentTarget.style.color = "white")}
        ></a>
        <a
          href="https://www.linkedin.com/company/tedxtiet/"
          target="_blank"
          rel="noreferrer"
          className="fa-brands fa-linkedin-in"
          style={{
            color: "white",
            fontSize: "28px",
            margin: "0 10px",
            transition: "color 0.3s",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0A66C2")}
          onMouseOut={(e) => (e.currentTarget.style.color = "white")}
        ></a>
        <a
          href="https://www.youtube.com/playlist?list=PLwvmGZzdo6jA8Fk6aVwQ5zAksnJfCf1o4"
          target="_blank"
          rel="noreferrer"
          className="fa-brands fa-youtube"
          style={{
            color: "white",
            fontSize: "28px",
            margin: "0 10px",
            transition: "color 0.3s",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#FF0000")}
          onMouseOut={(e) => (e.currentTarget.style.color = "white")}
        ></a>
      </div>
      <hr style={{ border: "1px solid white", marginBottom: "5px" }} />
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} TEDx TIET. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
