import React from "react";
import FlowingMenu from "./FlowingMenu";
import "./Sponsors.css";

function Sponsors() {
  const demoItems = [
    {
      link: "https://nashermiles.com/",
      text: "NASHER MILES",
      image: "/Sponsors/IMG_2160.JPG",
      className: "nasher-logo"
    },
    {
      link: "https://dobraindia.com/",
      text: "DOBRA",
      image: "/Sponsors/IMG_2159.JPG",
      className: "reduced-logo"
    },
    {
      link: "https://amoghconnect.com/",
      text: "AMOGH",
      image: "/Sponsors/Amogh.jpeg",
      className: "reduced-logo"
    },
    {
      link: "https://tooyumm.com/",
      text: "TOO YUMM!",
      image: "/Sponsors/TooYumm.jpg",
      className: "tooyumm-logo"
    },
    {
      link: "https://twistedtails.in/",
      text: "TWISTED TAILS",
      image: "/Sponsors/TwistedTails.jpg",
      className: "twisted-logo"
    },
    {
      link: "https://astoratravels.com/",
      text: "ASTORA TRAVELS",
      image: "/Sponsors/Astora.jpg",
      className: "astora-logo"
    },
  ];

  return (
    <>
      <div className="sponsors-page">
        <div className="sponsors-header">
          <h2>Our Sponsors</h2>
          <h3>
            Thank you to our amazing partners who make TEDx possible!
          </h3>
        </div>
        <FlowingMenu items={demoItems} />
      </div>
    </>
  );
}

export default Sponsors;
