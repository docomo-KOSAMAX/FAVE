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
      // APIを叩いてユーザー名の検証を行う(Postで)
      // `https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/users/${username}`
      fetch(`https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/users/${username}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok && response.status!==201) {
            //レスポンスの表示
            throw new Error('ユーザー名が無効です。' + response.statusText);
          }
          if (response.status === 201) {
            //ユーザーを新規作成しましたとポップアップ表示
            alert('ユーザーを新規作成しました。');
          }
          return response.json();
        })
        .then(() => {
          // 遷移
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
      border={1}
      borderRadius={2}
      boxShadow={3}
      maxWidth="600px"
      width="100%"
      bgcolor="background.paper"
    >

      <Typography variant="h4" gutterBottom>
        KOSAMAX
      </Typography>
      <img
        src="https://media.discordapp.net/attachments/968784586542829629/1283389160509407325/image.png?ex=66e2d0cc&is=66e17f4c&hm=9958737aacae580190375e2e7355abcda0b0fc442213b298e2501e554d4d7c2f&=&format=webp&quality=lossless&width=365&height=369"
        alt="KOSAMAX"
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
