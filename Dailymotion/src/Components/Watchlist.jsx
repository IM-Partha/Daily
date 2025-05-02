import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase/firebase';
import Navbar from './Navbar';
import LeftSidebar from './Leftsidebar';
import { CiCircleRemove } from "react-icons/ci";

const Watchlist = () => {
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarked videos from Firestore
  useEffect(() => {
    const fetchBookmarked = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "watchlist"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookmarkedVideos(videos);
      setLoading(false);
    };

    fetchBookmarked();
  }, []);

  // Handle video removal
  const handleRemoveBookmark = async (videoId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const videoRef = doc(db, "watchlist", videoId); // Assuming the document ID is stored in Firestore
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
        {loading ? (
          <p>Loading...</p>
        ) : bookmarkedVideos.length === 0 ? (
          <p>No bookmarked videos found.</p>
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
