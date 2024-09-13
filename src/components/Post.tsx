import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { styled } from '@mui/system';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fave } from '../types/index'; // 型のインポート
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 戻るアイコンのインポート
import SendIcon from '@mui/icons-material/Send'; // 投稿アイコンのインポート
import axios from "axios";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px', // ボタンの角を丸くする
  padding: '10px 20px', // パディングを設定
  fontSize: '16px', // フォントサイズを調整
  textTransform: 'none', // ボタンのテキストを小文字のままにする
  transition: 'all 0.3s ease', // ホバー時のアニメーション効果
  '&:hover': {
    transform: 'scale(1.05)', // ホバー時にボタンを拡大する
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // ホバー時の影
  },
}));

interface PostProps {
  onClose: () => void;
  handleUpdatePage: () => void;
}

const App: React.FC<PostProps> = ({ onClose, handleUpdatePage }) => {
  const navigate = useNavigate();
  const [newPost, setnewPost] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaves, setFilteredFaves] = useState<Fave[]>([]);
  const [selectedfaveId, setSelectedfaveId] = useState<number | null>(null);
  const [selectedfaveName, setSelectedfaveName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [faveData, setFaveData] = useState<Fave[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const api = axios.create({
    baseURL: 'https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test',
    timeout: 1000,
  });

  const userName = searchParams.get("name");
  //////////
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose(); // ボックス外をクリックした場合に閉じる
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // onCloseの依存性を追加
////////////

  useEffect(() => {
    api.get("/api/faves")
      .then((response) => {
        setFaveData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching faves:", error);
        setFaveData([
          { id: 12345, fave_name: "赤身かるび" },
          { id: 67890, fave_name: "琵琶湖くん" },
          { id: 24341, fave_name: "月ノ美兎" },
          { id: 24342, fave_name: "葛葉" },
          { id: 24343, fave_name: "本間ひまわり" },
          { id: 24344, fave_name: "星川サラ" },
        ]);
      });
  }, []);

  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };

  const handlePost = () => {
    setErrorMessage("");
    if (!selectedfaveId) {
      setErrorMessage("VTuberを選択してください");
      return;
    }
    if (!newPost) {
      setErrorMessage("テキストを入力してください");
      return;
    }

    const data = {
      message: newPost,
      fave_id: selectedfaveId,
    };

    api.post(`/api/favePosts/${userName}`, data)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          alert('投稿しました。');
          onClose();
          handleUpdatePage();
        } else if (response.status === 202) {
          setErrorMessage("ユーザ名が登録されていません。");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("投稿に失敗しました。もう一度お試しください。");
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredFaves([]);
    } else {
      const filtered = faveData
        .filter((fave) => fave.fave_name.includes(value))
        .slice(0, 5);
      setFilteredFaves(filtered);
    }
  };

  const handleSelect = (fave: Fave) => {
    setSelectedfaveId(fave.id);
    setSelectedfaveName(fave.fave_name);
    setSearchTerm("");
    setFilteredFaves([]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        ref={boxRef}
        sx={{
          padding: { xs: 2, sm: 5 },
          maxWidth: '450px',
          width: '100%',
          height: 'auto',
          boxShadow: '0px 0px 15px rgba(255, 255, 255, 0.4)',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          overflow: 'auto',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            布教する？
          </Typography>
        </Stack>

        <Box sx={{ mb: 2, position: 'relative' }}>
          <TextField
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="推しのVTuberを検索..."
            fullWidth
          />
          {filteredFaves.length > 0 && (
            <List
              sx={{
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: 0,
              }}
            >
              {filteredFaves.map((fave) => (
                <ListItem
                  key={fave.id}
                  disablePadding
                  sx={{ border: '1px solid #ccc', marginBottom: '0px', borderRadius: '2px' }}
                >
                  <ListItemButton onClick={() => handleSelect(fave)}>
                    <ListItemText primary={fave.fave_name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {selectedfaveName && (
          <Typography variant="body1">推しのVTuber：{selectedfaveName}</Typography>
        )}

        <StyledTextField
          multiline
          rows={6}
          variant="outlined"
          placeholder="推しコメントを入力"
          value={newPost}
          onChange={(e) => setnewPost(e.target.value)}
          sx={{ width: '100%' }}
        />

        <Typography variant="body2" align="right" sx={{ mb: 1 }}>
          {newPost.length}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Box display="flex" justifyContent="space-between">
          <StyledButton
            variant="outlined"
            startIcon={<ArrowBackIcon />} // 戻るボタンにアイコンを追加
            onClick={onClose}
            sx={{
              color: '#673ab7',
              borderColor: '#673ab7',
              outline: 'none', // フォーカス時の黒い枠を防ぐ
              boxShadow: 'none', // フォーカス時の影を消す
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
                boxShadow: 'none', // フォーカス時の影を消す
                transform: 'none', // フォーカス時の拡大を防ぐ
              },
              '&:hover': {
                boxShadow: 'none', // ホバー時の影を無効化
                transform: 'none', // ホバー時の拡大を防ぐ
              },
            }}
          >
            戻る
          </StyledButton>

          <StyledButton
            variant="contained"
            endIcon={<SendIcon />} // 投稿ボタンにアイコンを追加
            onClick={handlePost}
            disabled={!newPost || !selectedfaveId}
            sx={{
              background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
              color: 'white',
              outline: 'none', // フォーカス時の黒い枠を防ぐ
              boxShadow: 'none', // フォーカス時の影を消す
              '&:focus': {
                outline: 'none', // フォーカス時も黒い枠を防ぐ
                boxShadow: 'none', // フォーカス時の影を消す
                transform: 'none', // フォーカス時の拡大を防ぐ
              },
              '&:hover': {
                transform: 'none', // ホバー時の拡大を防ぐ
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)', // 無効時の背景色をグラデーションのまま薄くする
                color: 'rgba(255, 255, 255, 0.5)', // 無効時のテキスト色を薄くする
                opacity: 0.6, // 全体の透明度を設定
              },
            }}
          >
            投稿
          </StyledButton>



        </Box>
      </Box>
    </Box>
  );
}

export default App;
