import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import withAuth from './components/auth/withAuth';

import LoginScreen from './screens/login.js';
import HomeScreen from './screens/home.js';
import SignUpScreen from './screens/signup.js';
import JournalScreen from './screens/journal/journal.js';
import GalleryScreen from './screens/journal/gallery.js';
import PetScreen from './screens/pet/pet.js';
import PEScreen from './screens/pe/pe.js';
import TrackingScreen from './screens/tracking/tracking';

import Header from './components/header';

function App() {

  return (
    <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<LoginScreen />} />
          <Route path='/project-proudme' element={<LoginScreen />} />
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/signup' element={<SignUpScreen />} />
          <Route path='/home' element={<HomeScreen />} />
          <Route path='/journal' element={<JournalScreen />} />
          <Route path='/gallery' element={<GalleryScreen />} />
          <Route path='/pet' element={<PetScreen />} />
          <Route path='/pe' element={<PEScreen />} />
          <Route path='/tracking' element={<TrackingScreen />} />
        </Routes>
    </div>
  );

}

export default App;

// want users to be able to input numbers and track their progress