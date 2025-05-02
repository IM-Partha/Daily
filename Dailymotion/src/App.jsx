import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ToastContainer from "./components/ToastContainer";
import Watchlist from "./components/Watchlist";
import VideoPage from "./components/VideoPage";
import Explore from "./components/Explore";
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <>
      <SearchProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
      </Routes>

      {/* Use the custom ToastContainer component here */}
      <ToastContainer />
      </SearchProvider>
    </>
  );
}

export default App;
