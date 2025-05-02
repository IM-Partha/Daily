import React, { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const handleWatchlistClick = () => {
    navigate('/watchlist');
  };

  const handleHomepage = () => {
    navigate('/');
  };

  const handlePlayVideo = (videoId) => {
    // Navigate to VideoPage with the videoId
    navigate(`/video/${videoId}`);
  };

  const handleExplore= ()=> {
    navigate('/explore')
  }

  useEffect(() => {
    const fetchApiData = async () => {
      const options = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/video/related-contents/',
        params: {
          id: 'kJQP7kiw5Fk', // sample video ID
          hl: 'en',
          gl: 'US'
        },
        headers: {
          'x-rapidapi-key': '94dacf3346msh6201d9388198241p1f5aa0jsn3522851446e0',
          'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setRecommendations(response.data.contents || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchApiData();
  }, []);

  return (
    <div className="cursor-pointer hidden md:block w-64 h-[calc(100vh-88px)] bg-white text-black p-6 fixed top-24 left-0 overflow-y-auto">
      <ul className="space-y-6 mb-8">
        <li onClick={handleHomepage} className="flex items-center gap-4 hover:text-gray-400">
          <IoHomeOutline size={24} />
          <span>For You</span>
        </li>
        <li onClick={handleExplore} className="flex items-center gap-4 hover:text-gray-400">
          <MdOutlineExplore size={24} />
          <span>Explore</span>
        </li>
        <li onClick={handleWatchlistClick} className="flex items-center gap-4 hover:text-gray-400">
          <CiBookmark size={24} />
          <span>Watchlist</span>
        </li>
      </ul>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Recommended</h3>
        {recommendations.map((item, index) => {
          const video = item.video;
          if (!video) return null;

          return (
            <div key={index} className="mb-4">
              <p
                onClick={() => handlePlayVideo(video.videoId)}  // Add click event to play the video
                className="text-sm mt-1 font-medium line-clamp-2 hover:text-blue-500 cursor-pointer"
              >
                {video.title.slice(0, 25)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
