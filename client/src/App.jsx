
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Router from './routes/Router'

function App() {

  return (
    <>
    
      <Routes>
        <Route path="/*" element={<Router />} />

      </Routes>
    
    </>
  )
}

export default App
