import React, { useRef, useEffect } from 'react';

const Camera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ask for permission and get video stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  return (
    <div>
      <h2>Live Camera Feed</h2>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
    </div>
  );
};

export default Camera;
