import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import HeroSection from "./Components/HeroSection";
import CustomNavbar from "./Components/navbar";
import Cards from "./Components/Cards.jsx";
import ProfileCard from "./Components/ProfileCard.jsx";
import Footer from "./Components/Footer.jsx";
import NotFound from "./Components/NotFound";
// import Team from "./Components/Team.jsx";
import Sponsors from "./Components/Sponsors.jsx";
import Speaker from "./Components/Speaker.jsx";
import StatsOverview from "./Components/StatsOverview.jsx";
import Reveal from "./Components/Reveal"; // preloader
import ContactForm from "./Components/ContactForm.jsx";
import InfiniteGallery from "./Components/infiniteGallery.jsx";
import EbGrid from "./Components/EbGrid.jsx";
import Event from "./Components/Event.jsx"; // ✅ Event page
import Register from "./Components/Register.jsx"; // ✅ Register page
// import PopupOverlay from "./Components/PopupOverlay";
import EventDetails from "./Components/EventDetails";
import StackedCards from "./Components/StackedCards";
import Alumni from "./Components/alumni";
import Team from "./Components/Team.jsx";

// Scroll handler for /aboutus → testimonials
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/aboutus") {
      const testimonials = document.getElementById("testimonials");
      if (testimonials) {
        testimonials.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader for ~2s, then remove
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Reveal />; // Show preloader first
  }

  return (
    <div className="App">
      <CustomNavbar />
      <ScrollHandler />

      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <header className="App-header">
                <HeroSection />
                <EventDetails />
                <StackedCards />
                <div id="testimonials"></div>
              </header>
              <StatsOverview />
              <Cards />
              <Footer />
            </>
          }
        />

        {/* Redirect /aboutus → home */}
        <Route path="/aboutus" element={<Navigate to="/" />} />

        {/* Event page */}
        <Route path="/event" element={<Event />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Optional direct component routes */}
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/gallery" element={<InfiniteGallery />} />
        <Route path="/sponsor" element={<Sponsors />} />
        <Route path="/speakers" element={<Speaker />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/team" element={<Team/>} />
        <Route path="/alumni" element={<Alumni />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
