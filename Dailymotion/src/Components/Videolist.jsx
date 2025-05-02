import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiBookmark } from 'react-icons/ci';
import { Link } from 'react-router-dom'; 
import LoadingSkeleton from './LoadingSkeleton'; 
import { auth, db } from '../firebase/firebase';  
import { toast } from 'react-toastify';  
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useSearch } from '../context/SearchContext';  // Import the search context

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set());
  const [user, setUser] = useState(null);

  const { searchQuery, updateSearchQuery } = useSearch();  // Access searchQuery from context

  useEffect(() => {
    // Log searchQuery to verify if you're getting the value correctly
    // console.log('Search Query from context:', searchQuery);

    // Fetch videos from API
    async function fetchVideos(query) {
      const options = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/search/',
        params: {
          q: query || 'cartoon', // Use searchQuery or default to 'cartoon'
          hl: 'en',
          gl: 'US',
        },
        headers: {
          'x-rapidapi-key': '94dacf3346msh6201d9388198241p1f5aa0jsn3522851446e0',
          'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setVideos(response.data.contents || []);
      } catch (err) {
        setError('Error fetching videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos(searchQuery); 

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);  
    });

    return () => unsubscribe(); 
  }, [searchQuery]); 

  const handleBookmark = async (videoData) => {
    if (!user) {
      toast.error('Please log in to bookmark videos!', {
        position: toast.POSITION,
        autoClose: 3000,
      });
      return;
    }

    const docId = `${user.uid}_${videoData.videoId}`;
    const docRef = doc(db, "watchlist", docId);

    try {
      if (bookmarkedVideos.has(videoData.videoId)) {
        await deleteDoc(docRef);
        setBookmarkedVideos((prevState) => {
          const updatedBookmarks = new Set(prevState);
          updatedBookmarks.delete(videoData.videoId);
          return updatedBookmarks;
        });
      } else {
        await setDoc(docRef, {
          ...videoData,
          userId: user.uid,
          savedAt: new Date(),
        });
        setBookmarkedVideos((prevState) => {
          const updatedBookmarks = new Set(prevState);
          updatedBookmarks.add(videoData.videoId);
          return updatedBookmarks;
        });
      }
    } catch (error) {
      toast.error('Error managing bookmark!', {
        position: toast.POSITION,
        autoClose: 3000,
      });
      console.error("Error with bookmark operation:", error);
    }
  };

  const handleSearchChange = (e) => {
    updateSearchQuery(e.target.value);  
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-5">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for videos..."
        className="p-2 mb-4 w-full border rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {videos.length > 0 ? (
          videos.map((video, index) => {
            const videoData = video.video;
            if (!videoData) return null;

            const isBookmarked = bookmarkedVideos.has(videoData.videoId);

            const thumbnail = videoData.thumbnails?.[1]?.url || videoData.thumbnails?.[0]?.url || 'fallback-image.jpg';

            return (
              <div key={index} className="relative shadow-md p-4 rounded-md bg-white hover:shadow-lg transition duration-300">
                <button
                  onClick={() => handleBookmark(videoData)}
                  className={`ml-25 absolute top-3 right-3 text-gray-500 hover:text-red-500 transition duration-200 ${isBookmarked ? 'bg-yellow-400' : ''} p-2 rounded-full`}
                >
                  <CiBookmark style={{ color: 'black', cursor: 'pointer' }} size={28} />
                </button>

                <Link to={`/video/${videoData.videoId}`} className="block">
                  <img src={thumbnail} alt={videoData.title} className="w-full rounded mb-4" />
                  <h3 className="font-semibold text-md mb-1">{videoData.title}</h3>
                  <p className="text-sm text-gray-600">{videoData.channelName}</p>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-center">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;
