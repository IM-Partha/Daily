import React from 'react'
import Navbar from '../Components/Navbar'
import Leftsidebar from '../Components/Leftsidebar'
import VideoList from '../Components/Videolist'

const Home = () => {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="flex">
        <Leftsidebar />
        <div className="p-4 md:flex-1 lg:ml-64"> 
          <VideoList />
        </div>
      </div>
    </div>
  )
}

export default Home
