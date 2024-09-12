import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username) {
      // APIを叩いてユーザー名の検証を行う
      fetch(`/api/users/${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('ユーザー名が無効です。');
          }
          return response.json();
        })
        .catch((error) => {
          console.error('Error logging in:', error);
          setError('ログインに失敗しました。ユーザー名を確認してください。');
        });

      // 遷移
      navigate(`/?name=${username}`);

    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      border={1}
      borderRadius={2}
      boxShadow={3}
      maxWidth="400px"
      width="100%"
      bgcolor="background.paper"
    >
      <Typography variant="h4" gutterBottom>
        チームBの入り口
      </Typography>
      <TextField
        label="ユーザー名"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown} // Enterキーのイベントハンドラを追加
        sx={{ marginBottom: 2, width: '100%' }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <Button variant="contained" onClick={handleLogin} fullWidth>
        ログイン または サインアップ
      </Button>
    </Box>
  );
}
