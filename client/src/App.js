import "App.css";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignUpScreen from "screens/account/signup.js";
import LoginScreen from "screens/account/login.js";
import HomeScreen from "screens/home.js";
import JournalScreen from "screens/journal/journal.js";
import GalleryScreen from "screens/journal/gallery.js";
import PetScreen from "screens/pet/pet.js";
import PEScreen from "screens/pe/pe.js";
import TrackingScreen from "screens/tracking/tracking";
import RecoveryScreen from "screens/account/recovery";
import LunchScreen from "screens/lunch/lunch";

import Header from "components/header/header";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" &&
        location.pathname !== "/recovery" &&
        location.pathname !== "/signup" &&
        location.pathname !== "/" && <Header />}
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/project-proudme" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/recovery" element={<RecoveryScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/journal" element={<JournalScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
        <Route path="/pet" element={<PetScreen />} />
        <Route path="/pe" element={<PEScreen />} />
        <Route path="/tracking" element={<TrackingScreen />} />
        <Route path="/lunchroom" element={<LunchScreen />} />
      </Routes>
    </div>
  );
}

export default App;
