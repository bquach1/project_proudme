import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import withAuth from "./components/auth/withAuth";

import SignUpScreen from "./screens/account/signup.js";
import LoginScreen from "./screens/account/login.js";
import HomeScreen from "./screens/home.js";
import JournalScreen from "./screens/journal/journal.js";
import GalleryScreen from "./screens/journal/gallery.js";
import PetScreen from "./screens/pet/pet.js";
import PEScreen from "./screens/pe/pe.js";
import TrackingScreen from "./screens/tracking/tracking";
import RecoveryScreen from "./screens/account/recovery";

import Header from "./components/header";

function App() {

  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`https://project-proudme.onrender.com/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <Header />
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
        <Route path="/tracking" element={<TrackingScreen user={user} />} />
      </Routes>
    </div>
  );
}

export default App;

// want users to be able to input numbers and track their progress
