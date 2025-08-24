import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import './App.css'


const App = () => {
  return (
    <div className="w-screen min-h-screen bg-black flex flex-col">
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App