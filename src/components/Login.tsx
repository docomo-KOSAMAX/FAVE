import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';

export default function App() {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username) {
      navigate(`/?name=${username}`);
    }
  };

  return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4} // パディングを追加
        border={1} // ボーダーを追加してボックスの視覚的な枠線を設定
        borderRadius={2} // 角を丸くする
        boxShadow={3} // シャドウを追加
        maxWidth="400px" // ボックスの最大幅を設定
        width="100%" // ボックスの幅を100%に設定
        bgcolor="background.paper" // 背景色を設定
      >
        <Typography variant="h4" gutterBottom>
          Vファンダムへの入り口
        </Typography>
        <TextField
          label="ユーザー名"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: 2, width: '100%' }} // テキストフィールドの幅をボックスに合わせる
        />
        <Button variant="contained" onClick={handleLogin} fullWidth>
          ログイン または サインアップ
        </Button>
      </Box>
  );
}
