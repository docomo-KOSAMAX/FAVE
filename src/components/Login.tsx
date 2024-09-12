import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});

export default function App() {
  const classes = useStyles();
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username) {
      fetch(`https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/users/${username}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok && response.status !== 201) {
            throw new Error('ユーザー名が無効です。' + response.statusText);
          }
          if (response.status === 201) {
            alert('ユーザーを新規作成しました。');
          }
          return response.json();
        })
        .then(() => {
          navigate(`/?name=${username}`);
        })
        .catch((error) => {
          console.error('【Error logging in】:', error);
          setError('ログインに失敗しました。ユーザー名を確認してください。');
        });
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
      borderRadius={2}
      maxWidth="600px"
      width="100%"
      bgcolor="rgba(255, 255, 255, 0.7)" // 半透明の白い背景
      position="relative"
      sx={{
        backdropFilter: 'blur(10px)', // 背景のぼかし効果
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)', // 全方向に影を追加
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: '2px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        FAVE
      </Typography>
      <img
        src="https://media.discordapp.net/attachments/968784586542829629/1283740202304798721/Firefly_logo_web_app_anime_vtuber_96844.jpg?ex=66e417ba&is=66e2c63a&hm=84c3e92b442163058740fb63603d38d27b824479a63e7f736303451f99aa285a&=&format=webp&width=675&height=689"
        alt="FAVE"
        width={200}
        height={200}
        style={{ borderRadius: '50%', marginBottom: '16px' }} // 画像を丸くするスタイル
      />
      <Typography variant="h6" gutterBottom>
        ファンダムを活性化させるプラットフォーム
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
      <Button className={classes.root} variant="contained" onClick={handleLogin} fullWidth>
        ログイン または サインアップ
      </Button>
    </Box>
  );
}
