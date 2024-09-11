import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TimeLine from './components/Timeline'
import Login from './components/Login'
import Post from './components/Post'
import User from './components/User'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimeLine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App