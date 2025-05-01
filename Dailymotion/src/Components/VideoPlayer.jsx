import React from "react";

const VideoPlayer = ({ videoId }) => {
  return (
    <div className="video-player-container">
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
