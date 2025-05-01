import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../Components/VideoPlayer"; // Import the VideoPlayer component

const VideoPage = () => {
  const { videoId } = useParams(); // Get videoId from URL

  return (
    <div className="p-4">
      <VideoPlayer videoId={videoId} /> {/* Pass videoId to the VideoPlayer */}
    </div>
  );
};

export default VideoPage;
