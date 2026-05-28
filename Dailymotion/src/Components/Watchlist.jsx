import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '../Firebase/firebase';
import Navbar from './Navbar';
import LeftSidebar from './Leftsidebar';
import { CiCircleRemove } from "react-icons/ci";

const Watchlist = () => {
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [user, setUser] = useState(null);

  // Listen to Auth state changes and fetch bookmarked videos
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setBookmarkedVideos([]);
        return;
      }

      try {
        const q = collection(db, "users", currentUser.uid, "bookmarks");
        const querySnapshot = await getDocs(q);
        const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookmarkedVideos(videos);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle video removal
  const handleRemoveBookmark = async (videoId) => {
    if (!user) return;

    try {
      const videoRef = doc(db, "users", user.uid, "bookmarks", videoId);
      await deleteDoc(videoRef); // Delete the video from Firestore
      // Remove from local state
      setBookmarkedVideos((prevVideos) =>
        prevVideos.filter((video) => video.id !== videoId)
      );
    } catch (error) {
      console.error("Error removing bookmark: ", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      <LeftSidebar />
      <div className="flex-1 p-4 md:p-5 mt-20 md:ml-72">
        {bookmarkedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-2xl font-semibold text-gray-500">No Watchlist</p>
            <p className="text-gray-400 mt-2">Add videos to your watchlist to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarkedVideos.map((video, index) => (
              <div
                key={index}
                className="relative shadow-md p-4 rounded-md bg-white hover:shadow-lg transition duration-300"
              >
                <img
                  src={video.thumbnails?.[1]?.url || video.thumbnails?.[0]?.url}
                  alt={video.title}
                  className="w-full rounded mb-4"
                />
                <h3 className="font-semibold text-md mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.channelName}</p>

                {/* Remove Bookmark Button */}
                <div
                  onClick={() => handleRemoveBookmark(video.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition duration-200"
                >
                  <CiCircleRemove style={{ color: 'red', cursor: 'pointer' }} size={28} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
