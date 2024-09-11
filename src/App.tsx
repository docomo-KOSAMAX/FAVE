import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Post from "./components/Post";
import Timeline from "./components/timeline";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
