import React, { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const defaultRecommendations = [
  {
    video: {
      videoId: "dQw4w9WgXcQ",
      title: "Rick Astley - Never Gonna Give You Up",
      channelName: "Rick Astley"
    }
  },
  {
    video: {
      videoId: "kJQP7kiw5Fk",
      title: "Lo-Fi Beats for Studying & Relaxing",
      channelName: "Lofi Girl"
    }
  },
  {
    video: {
      videoId: "9bZkp7q19f0",
      title: "PSY - GANGNAM STYLE M/V",
      channelName: "officialpsy"
    }
  },
  {
    video: {
      videoId: "jNQXAC9IVRw",
      title: "Me at the zoo - First YouTube Video",
      channelName: "jawed"
    }
  }
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const handleWatchlistClick = () => {
    navigate('/watchlist');
  };

  const handlePlayVideo = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleExplore = () => {
    navigate('/');
  };

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
        const contents = response.data.contents || [];
        if (contents.length > 0) {
          setRecommendations(contents);
        } else {
          setRecommendations(defaultRecommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations, using fallbacks:", error);
        setRecommendations(defaultRecommendations);
      }
    };

    fetchApiData();
  }, []);

  return (
    <div className="cursor-pointer hidden md:block w-64 h-[calc(100vh-88px)] bg-white text-black p-6 fixed top-24 left-0 overflow-y-auto">
      <ul className="space-y-6 mb-8">
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
