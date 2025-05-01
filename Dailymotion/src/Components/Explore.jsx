import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiBookmark } from 'react-icons/ci';
import { auth, db } from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { setDoc, doc } from 'firebase/firestore';
import Navbar from './Navbar'; // Navbar component added here
import LeftSidebar from './Leftsidebar';

const categories = ['movie', 'music', 'sports', 'news', 'comedy'];

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(() => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      const options = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/search/',
        params: { q: category, hl: 'en', gl: 'US' },
        headers: {
          'x-rapidapi-key': '79732050efmshaa60ec78bdf06b9p1a3275jsnfea60d4c3d3c',
          'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
        },
      };

      try {
        const response = await axios.request(options);
        setVideos(response.data.contents || []);
      } catch (err) {
        console.error('Error fetching videos', err);
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, [category]);

  const handleBookmark = async (videoData) => {
    if (!user) {
      toast.error('Please log in to bookmark videos!');
      return;
    }

    const docId = `${user.uid}_${videoData.videoId}`;
    const docRef = doc(db, 'watchlist', docId);

    try {
      await setDoc(docRef, {
        ...videoData,
        userId: user.uid,
        savedAt: new Date(),
      });

      toast.success('Video bookmarked!');
    } catch (error) {
      toast.error('Failed to bookmark video');
      console.error('Bookmark error:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar /> {/* Navbar added here */}
      <LeftSidebar />

      <div className="flex-1 p-4 mt-20 md:ml-72">
        {/* Category Buttons */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full border 
                ${category === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'} 
                hover:bg-blue-500 hover:text-white transition`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Videos or Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill().map((_, idx) => (
                <div
                  key={idx}
                  className="shadow-md p-4 rounded-md bg-white animate-pulse"
                >
                  <div className="h-40 bg-gray-300 rounded mb-4" />
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              ))
            : videos.map((video, index) => {
                const videoData = video.video;
                if (!videoData) return null;

                return (
                  <div
                    key={index}
                    className="relative shadow-md p-4 rounded-md bg-white hover:shadow-lg transition duration-300"
                  >
                    <button
                      onClick={() => handleBookmark(videoData)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                    >
                      <CiBookmark size={28} />
                    </button>
                    <a href={`/video/${videoData.videoId}`} className="block">
                      <img
                        src={videoData.thumbnails?.[1]?.url || videoData.thumbnails?.[0]?.url}
                        alt={videoData.title}
                        className="w-full rounded mb-4"
                      />
                      <h3 className="font-semibold text-md mb-1 line-clamp-2">{videoData.title}</h3>
                      <p className="text-sm text-gray-600">{videoData.channelName}</p>
                    </a>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Explore;
