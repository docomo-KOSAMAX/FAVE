import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, useTheme, useMediaQuery } from '@mui/material'; // useMediaQueryをインポート
import { makeStyles } from '@mui/styles';
import faveLogo from '../assets/fave.svg';
import lightModeImage from '../assets/light.jpg';
import darkModeImage from '../assets/dark.png';

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
          navigate(`/timeline/?name=${username}`);
        })
        .catch((error) => {
          console.error('【Error logging in】:', error);
          setError('ログインに失敗しました。ユーザー名を確認してください。');
        });
    } else {
      setError('ユーザー名を入力してください。'); // ユーザー名が空の場合にエラーメッセージを設定
      return; // 処理を終了
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // ライトモードとダークモードで異なる画像のURLを設定
  const lightModeImageUrl = '../assets/light.jpg';
  const darkModeImageUrl = '../assets/dark.jpg';

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
        maxWidth="600px"
        width="80%"
        bgcolor="rgba(255, 255, 255, 0.7)"
        position="relative"
        sx={{
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)',
          maxHeight: '90vh', // 最大の高さを設定して伸びすぎを防ぐ
          overflowY: 'auto', // 内容が多すぎる場合はスクロールを表示,
          borderRadius: 2, // 角丸の設定を追加
        }}
      >
        {/* SVG画像の表示 */}
        <img
          src={faveLogo}
          alt="FAVE Logo"
          style={{ width: '200px', height: 'auto', marginBottom: '16px' }}
        />

        <img
          src={prefersDarkMode ? darkModeImage : lightModeImage} // prefersDarkModeに基づいて画像を切り替える
          alt="FAVE"
          width={200}
          height={200}
          style={{ borderRadius: '50%', marginBottom: '16px' }}
        />

        <Typography
          variant="h6" // h6相当のスタイルに設定
          gutterBottom
          sx={{
            textAlign: 'center',
            marginLeft: '8px', // 文字を少し右にずらす
          }}
        >
          推しを推し合う。
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
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
              boxShadow: 'none', // フォーカス時の影を消す
            },
            '&:hover': {
              background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
              boxShadow: '0 4px 8px 2px rgba(255, 105, 135, .4)',
            },
          }}
        >
          ログイン または サインアップ
        </Button>


        {/* クレジットを一貫したスタイルで表示 */}
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 4, display: 'inline' }} // 親要素はインライン表示
        >
          Made by KOSAMAX
          <span
            style={{
              display: 'inline',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                margin: '0 0.5rem',
              }}
            >
              {/* | を表示する擬似要素 */}
              <span
                style={{
                  display: 'none', // デフォルトは非表示
                }}
                className="separator"
              >
                |
              </span>
            </span>
            Powered by React and Material-UI
          </span>
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 1, display: 'inline' }} // 親要素はインライン表示
        >
          Background Image: UTAIRO BOX
          <span
            style={{
              display: 'inline',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                margin: '0 0.5rem',
              }}
            >
              {/* | を表示する擬似要素 */}
              <span
                style={{
                  display: 'none', // デフォルトは非表示
                }}
                className="separator"
              >
                |
              </span>
            </span>
            Icon Image: Adobe Firefly
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
