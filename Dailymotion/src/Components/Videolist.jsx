import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiBookmark } from 'react-icons/ci';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import LoadingSkeleton from './LoadingSkeleton'; 
import { auth, db } from '../Firebase/firebase';  // Assuming you're using Firebase
import { toast } from 'react-toastify';  // Import Toastify
import { deleteDoc, doc, setDoc } from 'firebase/firestore';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set()); // Set to track bookmarks
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch videos from API
    async function fetchVideos() {
      const options = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/search/',
        params: {
          q: 'cartoon',
          hl: 'en',
          gl: 'US',
        },
        headers: {
          'x-rapidapi-key': '79732050efmshaa60ec78bdf06b9p1a3275jsnfea60d4c3d3c',
          'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data.contents)
        setVideos(response.data.contents || []);
      } catch (err) {
        setError('Error fetching videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();

    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);  // Set user info if logged in
    });

    return () => unsubscribe();  // Cleanup on component unmount
  }, []);

  const handleBookmark = async (videoData) => {
    if (!user) {
      // If not logged in, show Toastify alert
      toast.error('Please log in!', {
        position: toast.POSITION,
        autoClose: 3000,
      });
      return;
    }

    const docId = `${user.uid}_${videoData.videoId}`;
    const docRef = doc(db, "watchlist", docId);

    if (bookmarkedVideos.has(videoData.videoId)) {
      // Remove the bookmark from Firestore if it's already bookmarked
      await deleteDoc(docRef);
      setBookmarkedVideos((prevState) => {
        const updatedBookmarks = new Set(prevState);
        updatedBookmarks.delete(videoData.videoId);  // Remove from state
        return updatedBookmarks;
      });
    } else {
      // Add the bookmark to Firestore
      await setDoc(docRef, {
        ...videoData,
        userId: user.uid,
        savedAt: new Date(),
      });
      setBookmarkedVideos((prevState) => {
        const updatedBookmarks = new Set(prevState);
        updatedBookmarks.add(videoData.videoId);  // Add to state
        return updatedBookmarks;
      });
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 mt-15">
      {videos.length > 0 ? (
        videos.map((video, index) => {
          const videoData = video.video;
          if (!videoData) return null;

          const isBookmarked = bookmarkedVideos.has(videoData.videoId);

          return (
            <div
              key={index}
              className="relative shadow-md p-4 rounded-md bg-white hover:shadow-lg transition duration-300"
            >
              {/* Bookmark icon with conditional yellow background */}
              <button
                onClick={() => handleBookmark(videoData)}
                className={`ml-25 absolute top-3 right-3 text-gray-500 hover:text-red-500 transition duration-200 ${isBookmarked ? 'bg-yellow-400' : ''} p-2 rounded-full`}
              >
                <CiBookmark style={{ color: 'black', cursor: 'pointer' }}  size={28} />
              </button>

              {/* Link to Video Page */}
              <Link to={`/video/${videoData.videoId}`} className="block">
                {/* Thumbnail */}
                <img
                  src={videoData.thumbnails[1]?.url || videoData.thumbnails[0]?.url}
                  alt={videoData.title}
                  className="w-full rounded mb-4"
                />

                {/* Title & Channel */}
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
  );
};

export default VideoList;
