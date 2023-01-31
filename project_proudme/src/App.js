import './App.css';
import * as React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import LoginScreen from './screens/login.js';
import HomeScreen from './screens/home.js';
import SignUpScreen from './screens/signup.js';
import JournalScreen from './screens/journal/journal.js';
import EatingScreen from './screens/journal/eating.js';
import ActivityScreen from './screens/journal/activity.js';
import GalleryScreen from './screens/journal/gallery.js';
import PetScreen from './screens/pet/pet.js';
import PEScreen from './screens/pe/pe.js';
import RecordList from './components/database/recordList';
import Edit from './components/database/edit';
import Create from './components/database/create';

import Header from './components/header';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<LoginScreen />} />
          <Route path='/project-proudme' element={<LoginScreen />} />
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/signup' element={<SignUpScreen />} />
          <Route path='/home' element={<HomeScreen />} />
          <Route path='/journal' element={<JournalScreen />} />
          <Route path='/eating' element={<EatingScreen />} />
          <Route path='/activity' element={<ActivityScreen />} />
          <Route path='/gallery' element={<GalleryScreen />} />
          <Route path='/pet' element={<PetScreen />} />
          <Route path='/pe' element={<PEScreen />} />
          <Route exact path="/db" element={<RecordList />} />
          <Route path="/db/edit/:id" element={<Edit />} />
          <Route path="/db/create" element={<Create />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
