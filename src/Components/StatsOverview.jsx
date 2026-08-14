import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { impactData } from '../data/impactData';
import './StatsOverview.css';

const StatsOverview = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="loading">Loading...</div>;
  }

  const isMobile = window.innerWidth < 768;

  return (
    <section className="stats-overview">
      <div className="stats-container">
        <header className="stats-header">
          <h1 className="main-title">{impactData.title}</h1>
          <h2 className="subtitle">{impactData.subtitle}</h2>
          <p className="description">{impactData.description}</p>
        </header>

        <div className={`stats-grid ${isMobile ? 'mobile' : ''}`}>
          {impactData.statistics.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;