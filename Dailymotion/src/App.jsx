import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ToastContainer from './components/ToastContainer'; // Import your custom ToastContainer component
import Watchlist from './Components/Watchlist';
import VideoPage from './Components/VideoPage';
import Explore from './Components/Explore';


function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/watchlist' element={<Watchlist />} /> 
        <Route path='/explore' element={<Explore />} /> 
        <Route path="/video/:videoId" element={<VideoPage />} />
      </Routes>

      {/* Use the custom ToastContainer component here */}
      <ToastContainer />
    </>
  );
}

export default App;
