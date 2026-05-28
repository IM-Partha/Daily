import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { IoArrowBackOutline } from "react-icons/io5";

const VideoPlayer = ({ videoId }) => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="flex flex-col space-y-6">
      {/* Premium Back Button */}
      <div className="flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 font-medium rounded-full shadow-sm hover:shadow-md border border-gray-200/80 transition duration-300 group cursor-pointer hover:bg-gray-50"
        >
          <IoArrowBackOutline className="text-lg transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Video Embed Card Container */}
      <div className="overflow-hidden rounded-2xl bg-black shadow-2xl border border-gray-100 aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          frameBorder="0"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video Player"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
