import "App.css";
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignUpScreen from "screens/account/signup.js";
import LoginScreen from "screens/account/login.js";
import HomeScreen from "screens/home.js";
import TeamScreen from "screens/team.js";
import JournalScreen from "screens/journal/journal.js";
import GalleryScreen from "screens/journal/gallery.js";
import PetScreen from "screens/pet/pet.js";
import PEScreen from "screens/pe/pe.js";
import TrackingScreen from "screens/tracking/tracking";
import RecoveryScreen from "screens/account/recovery";
import CafeteriaScreen from "screens/cafeteria/cafeteria";
import TechScreen from "screens/tech.js"; 
import ActivityScreen from "screens/journal/phone/activitiy.js"; 
import EatScreen from "screens/journal/phone/eat.js"; 
import ScreenScreen from "screens/journal/phone/screen.js"; 
import SleepScreen from "screens/journal/phone/sleep.js"; 
import ActivityData from "screens/tracking/phone/activityData";
import EatData from "screens/tracking/phone/eatData";
import ScreenData from "screens/tracking/phone/screenData";
import SleepData from "screens/tracking/phone/sleepData";
import LearnMoreScreen from "./screens/learnmore.js";
import DailyReports from "screens/DailyReports.js";

import Header from "components/header/header";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" &&
        location.pathname !== "/recovery" &&
        location.pathname !== "/signup" && <Header />}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/project-proudme" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/recovery" element={<RecoveryScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/team" element={<TeamScreen />} />
        <Route path="/journal" element={<JournalScreen />}>
          <Route path="activity" element={<ActivityScreen />} />
          <Route path="eat" element={<EatScreen />} />
          <Route path="screen" element={<ScreenScreen />} />
          <Route path="sleep" element={<SleepScreen />} />
        </Route>
        <Route path="/gallery" element={<GalleryScreen />} />
        <Route path="/pet" element={<PetScreen />} />
        <Route path="/pe" element={<PEScreen />} />
        <Route path="/tracking" element={<TrackingScreen />}>
          <Route path="activityData" element={<ActivityData />} />
          <Route path="eatData" element={<EatData />} />
          <Route path="screenData" element={<ScreenData />} /> 
          <Route path="sleepData" element={<SleepData />} /> 
        </Route>    
        <Route path="/cafeteria" element={<CafeteriaScreen />} />
        <Route path="/tech-help" element={<TechScreen />} />
        <Route path="/learnmore" element={<LearnMoreScreen />} />
        <Route path="/daily-reports" element={<DailyReports />} />
      </Routes>
    </div>
  );
}

export default App;
