import React, { useState, useEffect, useRef, useCallback } from 'react';

const AnimatedCounter = ({ targetNumber, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  const animateCounter = useCallback(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(targetNumber * easeOutCubic);

      setCount(currentValue);

      if (now < endTime) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [targetNumber, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, animateCounter]);

  return (
    <span ref={elementRef} style={{ display: 'inline-block' }}>
      {count.toLocaleString()}
    </span>
  );
};

export default AnimatedCounter;
