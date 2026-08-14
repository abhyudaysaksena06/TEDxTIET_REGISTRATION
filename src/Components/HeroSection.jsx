import React from "react";
import "./HeroSection.css";
import bgd2 from "../assets/HeroSection/bgd5.webp";
import img1 from "../assets/HeroSection/1.webp";
import img2 from "../assets/HeroSection/2.webp";
import img3copy from "../assets/HeroSection/31.webp";
import img3 from "../assets/HeroSection/3.webp";
import img5 from "../assets/HeroSection/5.webp";
import img6 from "../assets/HeroSection/6.webp";
import img7 from "../assets/HeroSection/7.webp";
import img4 from "../assets/HeroSection/4.webp";

// Each letter reveals its own image on hover.
const letters = [
  { char: "T", img: img1 },
  { char: "E", img: img2 },
  { char: "D", img: img3copy },
  { char: "x", img: img3 },
  { char: "T", img: img5 },
  { char: "I", img: img6 },
  { char: "E", img: img7 },
  { char: "T", img: img4 },
];

// Preloading lives in src/preloadMedia.js, which starts these fetches at app
// boot rather than when this component mounts.
const HeroSection = () => {
  return (
    <section className="homefnt" style={{ backgroundImage: `url(${bgd2}) ` }}>
      <div className="home">
        {letters.map((l, i) => (
          <span
            key={i}
            className="textmask"
            style={{ "--bg-img": `url(${l.img})` }}
          >
            {l.char}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
