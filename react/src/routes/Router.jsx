import { Routes, Route } from 'react-router-dom'
import Landing from '../views/Landing'
import JobSelection from '../pages/JobSelection'
import Interview from '../user/Interview/Interview'



function Router() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Landing />} />


        {/* Add more routes here as needed */}
        <Route path='/jobSelection' element={<JobSelection />} />
        <Route path='/interview' element={<Interview />} />

      </Routes>

    </>
  )
}

export default Router