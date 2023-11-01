import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gallery from './components/Gallery'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Gallery/>
    </div>
  )
}

export default App
