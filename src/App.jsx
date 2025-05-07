import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import StartPage from './components/StartPage'
import Chatbot from './components/Chatbot'

function App() {
  const [count, setCount] = useState(0)

  return (
     //<StartPage/>
     <Chatbot />
  )
}

export default App
