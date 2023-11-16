import React from 'react';
import Nav from './components/Nav.js';
import Footer from "./components/Footer.js";
import Intro from "./pages/Intro.js";
import Seating from "./pages/Seating.js";
import Diner from "./pages/Diner.js";
import Submission from "./pages/Submission.js";
import About from "./pages/About.js";
import { Routes, Route } from "react-router-dom";
import "./styles/style.css";

const App = () => {

  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/about" element={<About />} />
        <Route path="/seating" element={<Seating />} />
        <Route path="/dinner" element={<Diner />} />
        <Route path="/submission" element={<Submission />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
