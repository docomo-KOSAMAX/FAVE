import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ボタンがクリックされたときに呼び出される関数
  const handleLogin = () => {
    // 現在のパラメータを取得して'/Post'に渡す
    navigate(`/Post${location.search}`);
  };

  return (
    <div>
      <h1>タイムライン</h1>
      <Button variant="contained">Hello World</Button>
      <Button variant="contained" onClick={handleLogin}>
        投稿する
      </Button>
    </div>
  );
}
