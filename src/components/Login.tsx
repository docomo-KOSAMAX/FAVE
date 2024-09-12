import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, useTheme, useMediaQuery } from '@mui/material'; // useMediaQueryをインポート
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

export default function Login() {
  const classes = useStyles();
  const theme = useTheme();
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ダークモードかどうかをチェック
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

  // ライトモードとダークモードで異なる画像のURLを設定
  const lightModeImageUrl = 'https://media.discordapp.net/attachments/968784586542829629/1283740202304798721/Firefly_logo_web_app_anime_vtuber_96844.jpg?ex=66e417ba&is=66e2c63a&hm=84c3e92b442163058740fb63603d38d27b824479a63e7f736303451f99aa285a&=&format=webp&width=675&height=689';
  const darkModeImageUrl = 'https://media.discordapp.net/attachments/968784586542829629/1283389160509407325/image.png?ex=66e3798c&is=66e2280c&hm=f216c00acf9c02f0e8bda5bca26d9090448678448a61b0ba87c3752796159906&=&format=webp&quality=lossless&width=365&height=369';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        borderRadius={2}
        maxWidth="600px"
        width="100%"
        bgcolor="rgba(255, 255, 255, 0.7)"
        position="relative"
        sx={{
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)',
          maxHeight: '90vh', // 最大の高さを設定して伸びすぎを防ぐ
          overflowY: 'auto', // 内容が多すぎる場合はスクロールを表示,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '2px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          FAVE
        </Typography>
        <img
          src={prefersDarkMode ? darkModeImageUrl : lightModeImageUrl} // prefersDarkModeに基づいて画像を切り替える
          alt="FAVE"
          width={200}
          height={200}
          style={{ borderRadius: '50%', marginBottom: '16px' }}
        />

        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ファンダムを活性化させるプラットフォーム
        </Typography>

        <TextField
          label="ユーザー名"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
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

        {/* クレジットを一貫したスタイルで表示 */}
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          Made by KOSAMAX | Powered by React and Material-UI
        </Typography>

        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
          Background Image: UTAIRO BOX | Icon Image: Adobe Firefly
        </Typography>
      </Box>
    </Box>
  );
}
