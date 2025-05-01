import React from 'react'
import Navbar from '../components/Navbar'
import Leftsidebar from '../components/Leftsidebar'
import VideoList from '../components/Videolist'

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
