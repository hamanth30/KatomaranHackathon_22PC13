// // src/components/FaceAuth.jsx
// import React, { useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// const FaceAuth = ({ navigate }) => {
//   const webcamRef = useRef(null);
//   const [namePrompt, setNamePrompt] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const navigate = useNavigate(); 

//   // const capture = async () => {
//   //   setLoading(true);
//   //   setError("");
//   //   const imageSrc = webcamRef.current.getScreenshot();
//   //   setCapturedImage(imageSrc);
//   //   const blob = await (await fetch(imageSrc)).blob();
//   //   const formData = new FormData();
//   //   formData.append("image", blob, "face.jpg");

//   //   // try {
//   //   //   const res = await axios.post("http://localhost:5000/api/face-auth", formData);
//   //   //   const data = res.data;

//   //   //   if (data.status === "recognized") {
//   //   //     // Face is recognized, retrieve name from MongoDB
//   //   //     try {
//   //   //       const userRes = await axios.get(`http://localhost:5000/api/face-auth/user/${data.userId}`);
//   //   //       const userData = userRes.data;
//   //   //       alert(`Welcome back ${userData.name}!`);
//   //   //       navigate("/chatbot");
//   //   //     } catch (err) {
//   //   //       console.error("Error fetching user data:", err);
//   //   //       setError("Error retrieving user information");
//   //   //     }
//   //   //   } else if (data.status === "new_face") {
//   //   //     // New face detected, prompt for name
//   //   //     setNamePrompt(true);
//   //   //   } else {
//   //   //     setError(data.message || "Authentication failed");
//   //   //   }
//   //   // } catch (err) {
//   //   //   console.error(err);
//   //   //   setError("Error connecting to server");
//   //   // } finally {
//   //   //   setLoading(false);
//   //   // }
    
//   // };

//   const capture = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       // Simulate processing delay
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Redirect to Chatbot page
//       navigate("/chatbot");
//     } catch (err) {
//       navigate("/chatbot");
//       console.error("Error:", err);
//       setError("An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleRegistration = async () => {
//     if (!userName.trim()) {
//       setError("Please enter your name");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     const blob = await (await fetch(capturedImage)).blob();
//     formData.append("image", blob, "face.jpg");
//     formData.append("name", userName);

//     try {
//       const res = await axios.post("http://localhost:5000/api/face-auth/register", formData);
//       if (res.data.status === "registered") {
//         alert(`Welcome ${userName}! You have been registered.`);
//         navigate("/chatbot");
//       } else {
//         setError("Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error during registration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="w-full rounded-lg shadow-lg"
//         />
        
//         {!namePrompt ? (
//           <button 
//             onClick={capture} 
//             className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Authenticate"}
//           </button>
//         ) : (
//           <div className="bg-green-50 rounded-lg shadow-lg p-6 border border-green-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-4">
//               New User Registration
//             </h3>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="w-full p-3 mb-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
//             />
//             <button
//               onClick={handleRegistration}
//               className="w-full py-3 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
//               disabled={loading}
//             >
//               {loading ? "Registering..." : "Submit"}
//             </button>
//           </div>
//         )}
        
//         {error && (
//           <p className="text-red-500 text-center mt-4 bg-red-50 p-3 rounded-lg">
//             {error}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FaceAuth;

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import bg from "/src/components/image.png";


const FaceAuth = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const backgroundStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleAuthenticate = async () => {
    setLoading(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to Chatbot page
      navigate("/chatbot");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="rounded-lg shadow-lg bg-white p-5 text-black font-bold text-xl">AI powered Face recognition
      <div className="w-full max-w-md p-8 space-y-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg shadow-lg"
        />
        <button
          onClick={handleAuthenticate}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : "Authenticate"}
        </button>
      </div>
    </div>
      <div className="rounded-lg shadow-lg mt-5 p-4 bg-white font-bold text-xl text-black">
            Authenticate your face to access the chat application. 
            <br />Please ensure your face is clearly visible in the camera.
      </div>
    </div>
  );
};

export default FaceAuth;