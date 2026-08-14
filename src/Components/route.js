import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CustomNavbar from "./CustomNavbar";
import HeroSection from "./HeroSection";
import TestimonialSlider from "./TestimonialSlider";
import CustomNavbar from "./navbar";
import RadialOrbitalTimeline from "./radial-orbital-timeline";

function App() {
    return (
        <Router>
            <CustomNavbar />
            <Routes>
                <Route path="/home" element={<HeroSection />} />
                <Route path="/aboutus" element={<TestimonialSlider />} />
                <Route path="/speaker" element={<RadialOrbitalTimeline />} />
            </Routes>
        </Router>
    );
}

export default App;