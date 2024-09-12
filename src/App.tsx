import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TimeLine from './components/Timeline';
import Login from './components/Login';
import Post from './components/Post';
import User from './components/User';
import './index.css'; // index.cssをインポート

// カスタムテーマの作成
const theme = createTheme({
  typography: {
    // 全体のフォントファミリーを指定（レイアウトは変えず、フォントだけ変更）
    fontFamily: `'Noto Sans JP', sans-serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={import.meta.env.DEV ? "/" : "/VtuberFukyou/"}>
        <Routes>
          <Route path="/" element={<TimeLine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<Post />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
