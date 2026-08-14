import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from './CircularProgress';
import AnimatedCounter from './AnimatedCounter';
import './StatCard.css';

const StatCard = ({ stat, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const isSocialMedia = stat.isSocialMedia;

  const getCircleSize = () => {
    if (window.innerWidth >= 1200) return 110;
    if (window.innerWidth >= 900) return 100;
    if (window.innerWidth >= 768) return 90;
    return 80;
  };

  const circleSize = getCircleSize();

  return (
    <div
      ref={cardRef}
      className={`stat-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="progress-container">
        <CircularProgress
          progress={isVisible ? stat.maxProgress : 0}
          size={circleSize}
          strokeWidth={4}
        />
        <div className="stat-icon-center" style={{ fontSize: `${circleSize * 0.25}px` }}>
          <span>{stat.icon}</span>
        </div>
      </div>

      <div className="stat-content">
        <div className="stat-number" style={{ fontSize: `clamp(1.5rem, ${circleSize * 0.18}px, 2rem)` }}>
          {isSocialMedia ? stat.number : (
            <>
              <AnimatedCounter targetNumber={stat.value} />
              {stat.number.includes('+') ? '+' : ''}
            </>
          )}
        </div>
        <div className="stat-label" style={{ fontSize: `clamp(0.8rem, ${circleSize * 0.1}px, 1rem)` }}>
          {stat.label}
        </div>
        <p className="stat-description" style={{ fontSize: `clamp(0.7rem, ${circleSize * 0.08}px, 0.85rem)` }}>
          {stat.description}
        </p>
      </div>
    </div>
  );
};

export default StatCard;