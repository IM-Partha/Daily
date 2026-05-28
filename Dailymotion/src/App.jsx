import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ToastContainer from "./Components/ToastContainer";
import Watchlist from "./Components/Watchlist";
import VideoPage from "./Components/VideoPage";
import Explore from "./Components/Explore";
import { SearchProvider } from "./Context/SearchContext";

function App() {
  return (
    <>
      <SearchProvider>
      <Routes>
        <Route path="/" element={<Explore />} />
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
