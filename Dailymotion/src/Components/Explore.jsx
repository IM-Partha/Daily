import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CiBookmark } from 'react-icons/ci';
import { auth, db } from '../firebase/firebase';
import { toast } from 'react-toastify';
import { setDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from './Navbar';
import LeftSidebar from './Leftsidebar';

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchVideos(); // initial fetch
  }, []);

  const fetchVideos = async (cursor = null) => {
    cursor ? setIsLoadingMore(true) : setLoading(true);

    const options = {
      method: 'GET',
  url: 'https://youtube-data8.p.rapidapi.com/playlist/videos/',
  params: {
    id: 'PLcirGkCPmbmFeQ1sm4wFciF03D_EroIfr',
    hl: 'en',
    gl: 'US'
  },
  headers: {
    'x-rapidapi-key': '94dacf3346msh6201d9388198241p1f5aa0jsn3522851446e0',
    'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
  },
    };

    try {
      const response = await axios.request(options);
      const newVideos = response.data.contents || [];

      setVideos((prev) => [...prev, ...newVideos]);
      setNextCursor(response.data.cursorNext || null);
    } catch (err) {
      console.error('Error fetching videos', err);
      toast.error('Failed to load videos');
    } finally {
      cursor ? setIsLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;

      const q = query(collection(db, 'watchlist'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const ids = querySnapshot.docs.map((doc) => doc.data().videoId);
      setBookmarkedIds(ids);
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmark = useCallback(
    async (videoData) => {
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

        setBookmarkedIds((prev) => [...prev, videoData.videoId]);
        toast.success('Video bookmarked!');
      } catch (error) {
        toast.error('Failed to bookmark video');
        console.error('Bookmark error:', error);
      }
    },
    [user]
  );

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <LeftSidebar />

      <div className="flex-1 p-4 mt-20 md:ml-72">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading
            ? Array(6)
                .fill()
                .map((_, idx) => (
                  <div key={idx} className="shadow-md p-4 rounded-md bg-white animate-pulse">
                    <div className="h-40 bg-gray-300 rounded mb-4" />
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                ))
            : videos.length > 0
              ? videos.map((video, index) => {
                  const videoData = video.video || video;
                  if (!videoData?.videoId) return null;

                  const isBookmarked = bookmarkedIds.includes(videoData.videoId);

                  return (
                    <div
                      key={index}
                      className="relative shadow-md p-4 rounded-md bg-white hover:shadow-lg transition duration-300"
                    >
                      <button
                        onClick={() => handleBookmark(videoData)}
                        className={`absolute top-3 right-3 text-gray-500 hover:text-red-500 transition cursor-pointer p-1 rounded-full
                          ${isBookmarked ? 'bg-yellow-300' : 'bg-transparent'}`}
                      >
                        <CiBookmark size={28} />
                      </button>
                      <a href={`/video/${videoData.videoId}`} className="block">
                        <img
                          src={videoData.thumbnails?.[1]?.url || videoData.thumbnails?.[0]?.url}
                          alt={videoData.title}
                          className="w-full rounded mb-4"
                        />
                        <h3 className="font-semibold text-md mb-1 line-clamp-2">
                          {videoData.title}
                        </h3>
                        <p className="text-sm text-gray-600">{videoData.channelName}</p>
                      </a>
                    </div>
                  );
                })
              : (
                <p className="text-center text-gray-500 col-span-full">No videos found.</p>
              )}
        </div>

        {nextCursor && (
          <div className="mt-8 text-center">
            <button
              onClick={() => fetchVideos(nextCursor)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
