// src/components/FaceAuth.jsx
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceAuth = ({ navigate }) => {
  const webcamRef = useRef(null);
  const [namePrompt, setNamePrompt] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    setLoading(true);
    setError("");
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append("image", blob, "face.jpg");
    if (userName) formData.append("name", userName);

    try {
      const res = await axios.post("http://localhost:8000/face-auth", formData);
      const data = res.data;

      if (data.status === "recognized") {
        // Face is recognized, retrieve name from MongoDB
        try {
          const userRes = await axios.get(`http://localhost:8000/user/${data.userId}`);
          const userData = userRes.data;
          alert(`Welcome back ${userData.name}!`);
          navigate("/chatbot");
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Error retrieving user information");
        }
      } else if (data.status === "new_face") {
        // New face detected, prompt for name
        setNamePrompt(true);
      } else if (data.status === "registered") {
        // New user successfully registered
        alert(`Welcome ${data.name}! You have been registered.`);
        navigate("/chatbot");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }
    await capture();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />
      {!namePrompt ? (
        <button 
          onClick={capture} 
          className="mt-4 bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Authenticate"}
        </button>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={handleRegistration}
            className="ml-2 bg-green-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FaceAuth;
