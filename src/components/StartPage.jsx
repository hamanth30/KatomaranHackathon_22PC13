import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'   
import  bg from '/src/components/image.png'
import { useNavigate } from 'react-router-dom';

const StartPage = () => {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/face-auth'); // Redirect to FaceAuth page
      };

    const backgroundStyle = {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        color: 'white'
      };
  return (
    <div style={backgroundStyle}>
    
    <div className="bg-green-700 font-bold text-3xl p-4">
        Quick Chat 
    </div>
    <div>
        <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Chat Application</h1>
        <p className="text-lg text-center mt-4">Please sign up to continue</p>
    </div>
    <div className="rounded-lg shadow-lg p-4 max-w-md mx-auto mt-10 bg-white bg-opacity-80">

    <h2 className="text-2xl text-black font-semibold mb-4"> Quick Chat is an Online Chat application with face recongnition features and AI assisted chat bot</h2>
    
    <button className='ml-35 rounded-lg shadow-lg px-4 py-2 bg-red-400'
    onClick={handleGetStarted}>
        Get Started
    </button>

    </div>
  </div>
  )
}

export default StartPage