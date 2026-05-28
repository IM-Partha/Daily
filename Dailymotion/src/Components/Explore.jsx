import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiBookmark } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { auth, db } from '../Firebase/firebase';
import { toast } from 'react-toastify';
import { deleteDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useSearch } from '../Context/SearchContext';
import Navbar from './Navbar';
import LeftSidebar from './Leftsidebar';
import LoadingSkeleton from './LoadingSkeleton';

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedVideos, setBookmarkedVideos] = useState(new Set());
  const [user, setUser] = useState(null);

  const { searchQuery } = useSearch();

  useEffect(() => {
    // Fetch videos from API
    async function fetchVideos(query) {
      setLoading(true);
      setError(null);
      const options = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/search/',
        params: {
          q: query || 'cartoon',
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

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setBookmarkedVideos(new Set());
        return;
      }
      try {
        const q = collection(db, "users", user.uid, "bookmarks");
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map((doc) => doc.id);
        setBookmarkedVideos(new Set(ids));
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    fetchBookmarks();
  }, [user]);

  const handleBookmark = async (videoData) => {
    if (!user) {
      toast.error('Please log in to bookmark videos!');
      return;
    }

    const docRef = doc(db, "users", user.uid, "bookmarks", videoData.videoId);

    try {
      if (bookmarkedVideos.has(videoData.videoId)) {
        await deleteDoc(docRef);
        setBookmarkedVideos((prevState) => {
          const updatedBookmarks = new Set(prevState);
          updatedBookmarks.delete(videoData.videoId);
          return updatedBookmarks;
        });
        toast.success('Bookmark removed!');
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
        toast.success('Video bookmarked!');
      }
    } catch (error) {
      toast.error('Error managing bookmark!');
      console.error("Error with bookmark operation:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Navbar />
      <LeftSidebar />

      <div className="flex-1 p-4 md:p-5 mt-20 md:ml-72">
        {loading ? (
          <div className="mt-5">
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
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
                      className={`absolute top-3 right-3 text-gray-500 hover:text-red-500 transition duration-200 ${isBookmarked ? 'bg-yellow-400' : ''} p-2 rounded-full`}
                    >
                      <CiBookmark style={{ color: 'black', cursor: 'pointer' }} size={28} />
                    </button>

                    <Link to={`/video/${videoData.videoId}`} className="block">
                      <img src={thumbnail} alt={videoData.title} className="w-full rounded mb-4" />
                      <h3 className="font-semibold text-md mb-1 line-clamp-2">{videoData.title}</h3>
                      <p className="text-sm text-gray-600">{videoData.channelName}</p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="text-center col-span-full mt-10">No videos found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
