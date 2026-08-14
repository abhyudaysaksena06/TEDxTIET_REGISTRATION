import React from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

function FlowingMenu({ items = [] }) {
  return (
    <div className="flowing-menu">
      <nav className="flowing-menu-nav">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, className }) {
  const itemRef = React.useRef(null);
  const marqueeRef = React.useRef(null);
  const marqueeInnerRef = React.useRef(null);
  const animationRef = React.useRef(null);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist =
      (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const startY = edge === "top" ? "-100%" : "100%";
    const endY = "0%";

    animationRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: startY })
      .set(marqueeInnerRef.current, {
        y: edge === "top" ? "100%" : "-100%",
      })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: endY });
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current)
      return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height
    );

    const endY = edge === "top" ? "-100%" : "100%";

    animationRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: endY })
      .to(marqueeInnerRef.current, {
        y: edge === "top" ? "100%" : "-100%",
      });
  };

  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const singleContent = (
    <>
      <span className="menu-text">{text}</span>
      <div
        className={`menu-image ${className || ""}`}
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );

  const repeatedMarqueeContent = Array.from({ length: 12 }).map(
    (_, idx) => <React.Fragment key={idx}>{singleContent}</React.Fragment>
  );

  return (
    <div className="menu-item" ref={itemRef}>
      <a
        className="menu-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef}>
        <div className="marquee-inner" ref={marqueeInnerRef}>
          <div className="marquee-track">{repeatedMarqueeContent}</div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
