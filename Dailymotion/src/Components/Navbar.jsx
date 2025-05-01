import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import { CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { auth } from "../Firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';  
import { setSearchQuery } from '../Redux/searchSlice.js';  

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch(); 
  const searchQuery = useSelector(state => state.search.query); // Access search query from Redux store
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/explore');
  }

  const HandelClickForYou = () => {
    navigate('/');
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Handle search input and dispatch it to Redux store
  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));  // Update Redux store with new search query
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center shadow px-6 py-6 bg-white">
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        <div>
          <img className="h-5" src={Logo} alt="logo" />
        </div>
      </div>

      <div className="w-full md:w-auto flex mx-6">
        <input
          className="w-full md:w-[500px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search..."
          value={searchQuery} // Bind Redux state to input value
          onChange={handleSearchChange} // Update search query in Redux store
        />
      </div>

      <div className="hidden md:flex space-x-5">
        {!user ? (
          <>
            <Link
              to={"/login"}
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#ecf0f1] cursor-pointer p-2 border border-gray-300 rounded w-24"
            >
              <CiLogin className="text-lg" />
              Login
            </Link>
            <Link
              to={"/register"}
              className="flex items-center justify-center gap-2 bg-black text-white hover:bg-[#bdc3c7] hover:text-black cursor-pointer p-2 border border-gray-300 rounded w-24"
            >
              <CgProfile className="text-lg" />
              Register
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            {user.displayName && (
              <span className="text-lg font-medium">{user.displayName}</span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col space-y-6 z-50 transition-all duration-300">
          <button onClick={() => setMenuOpen(false)} className="self-end">
            <FiX className="cursor-pointer" size={24} />
          </button>

          <ul className="space-y-6 mb-4">
            <li onClick={HandelClickForYou} className="flex items-center gap-4 hover:text-gray-400 cursor-pointer">
              <IoHomeOutline size={24} />
              <span>For You</span>
            </li>
            <li onClick={handleExplore} className="flex items-center gap-4 hover:text-gray-400 cursor-pointer">
              <MdOutlineExplore size={24} />
              <span>Explore</span>
            </li>
            <li className="flex items-center gap-4 hover:text-gray-400 cursor-pointer">
              <CiBookmark size={24} />
              <span>Watchlist</span>
            </li>
          </ul>

          <div className="flex flex-col space-y-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white hover:bg-[#ecf0f1] p-2 border border-gray-300 rounded justify-center"
                >
                  <CiLogin className="cursor-pointer text-lg" />
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-black text-white hover:bg-[#bdc3c7] hover:text-black p-2 border border-gray-300 rounded justify-center"
                >
                  <CgProfile className="cursor-pointer text-lg" />
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.displayName && (
                  <span className="text-center font-medium text-lg">
                    {user.displayName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 p-2 border border-gray-300 rounded justify-center"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
