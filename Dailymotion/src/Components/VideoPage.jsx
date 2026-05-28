import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer"; // Import the VideoPlayer component
import Navbar from "./Navbar";
import LeftSidebar from "./Leftsidebar";

const VideoPage = () => {
  const { videoId } = useParams(); // Get videoId from URL

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Navbar />
      <LeftSidebar />
      <div className="flex-1 p-4 md:p-8 mt-24 md:ml-72 flex justify-center">
        <div className="w-full max-w-5xl">
          <VideoPlayer videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
