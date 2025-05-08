import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import StartPage from './components/StartPage'
import Chatbot from './components/Chatbot'
import FaceAuth from './components/FaceAuth'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/face-auth" element={<FaceAuth />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  </Router>
  //<Chatbot />
  //<FaceAuth/>
  )
}

export default App
