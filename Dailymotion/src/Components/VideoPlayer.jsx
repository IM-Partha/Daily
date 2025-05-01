import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const VideoPlayer = ({ videoId }) => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="video-player-container">
      <button
        onClick={() => navigate("/")} // Navigate to home page ("/")
        className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Back to Home
      </button>

      <iframe
        src={`https://www.youtube.com/embed/${videoId}`} // Embed YouTube video using videoId
        frameBorder="0"
        width="100%"
        height="500"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
