import React from "react";
import { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, TextField, Button, Typography, Stack, Divider } from "@mui/material";
import { styled } from '@mui/system';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fave } from '../types/index'; // 型のインポート
import axios from "axios";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

interface PostProps {
  onClose: () => void; // onClose 関数をプロップスとして受け取る
  handleUpdatePage: () => void; // handleUpdatePage 関数をプロップスとして受け取る
}

const App: React.FC<PostProps> = ({ onClose, handleUpdatePage}) => {
  const navigate = useNavigate();
  const [newPost, setnewPost] = useState<string>(""); //投稿ボックスに入力された文字列を保持
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(""); //検索ボックスに入力された文字列を保持
  const [filteredFaves, setFilteredFaves] = useState<Fave[]>([]); //入力に基づいてフィルタリングされた候補データを保持
  const [selectedfaveId, setSelectedfaveId] = useState<number | null>(null); // ユーザーが選択したfavesのIDを保持
  const [selectedfaveName, setSelectedfaveName] = useState<string | null>(null); //ユーザーが選択したfavesの名前を保持
  const [errorMessage, setErrorMessage] = useState<string>(""); // エラーメッセージ用の state を追加
  const [faveData, setFaveData] = useState<Fave[]>([]); // faveData を state に保存

  // Axiosインスタンスの作成
const api = axios.create({
  baseURL: 'https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test', // ここにBaseURLを設定
  timeout: 1000, // タイムアウト設定
});

  // URLからユーザー名を取得
  const userName = searchParams.get("name");

  // コンポーネントのマウント時にVTuberのリストを取得
  useEffect(() => {
    axios
      api.get(
        "/api/faves"
      )
      .then((response) => {
        setFaveData(response.data); // faveData を state に設定
      })
      .catch((error) => {
        console.error("Error fetching faves:", error);
        setFaveData([
          // エラー時にダミーデータを設定
          { id: 12345, fave_name: "赤身かるび" },
          { id: 67890, fave_name: "琵琶湖くん" },
          { id: 24341, fave_name: "月ノ美兎" },
          { id: 24342, fave_name: "葛葉" },
          { id: 24343, fave_name: "本間ひまわり" },
          { id: 24344, fave_name: "星川サラ" },
        ]);
      });
  }, []); // 初回マウント時にのみデータを取得

  // 戻るボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };

  //投稿ボタンがクリックされた時に呼び出される関数
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

    //送信するデータ
    const data = {
      message: newPost,
      fave_id: selectedfaveId,
    };

    console.log(data);

    axios
      api.post(`/api/favePosts/${userName}`, data)
      .then((response) => {
        console.log("Post successful:", response);
        // 投稿が成功したらタイムラインに遷移
        console.log("Post successful:", response);
        console.log("Status Code:", response.status); // ステータスコードをログに出力
        if (response.status === 200) {
          // ステータスコードが200ならタイムラインに遷移
          alert('投稿しました。');
          onClose();
          handleUpdatePage();
        } else if (response.status === 202) {
          // ステータスコードが202ならエラーメッセージを表示
          setErrorMessage("ユーザ名が登録されていません。");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("投稿に失敗しました。もう一度お試しください。");
      });
  };

  //検索ボックスの値が変更されたときのハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredFaves([]); // 検索ボックスが空の場合、候補をクリア
    } else {
      // 入力に基づいて候補をフィルタリングし、最大5件まで表示する
      const filtered = faveData
        .filter((fave) => fave.fave_name.includes(value))
        .slice(0, 5); // 先頭から5件のみ取得
      setFilteredFaves(filtered);
    }
  };

  //候補が選択されたときの処理
  const handleSelect = (fave: Fave) => {
    setSelectedfaveId(fave.id);
    setSelectedfaveName(fave.fave_name);
    setSearchTerm(""); // 選択後に検索ボックスをクリアする場合
    setFilteredFaves([]); // 選択後に候補を消す場合
  };


  return (
      <Box sx={{ padding: 10, maxWidth: '1000px', margin: '0 auto', boxShadow: 20,  backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '30px' }}>
        {/* 投稿フォームの上部にプロフィール画像を表示 */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {/* ボックス上に文字を表示 */}
          <Typography variant="h4">
            布教する？
          </Typography>
        </Stack>

        <Box sx={{ mb: 2 }}>
        {/* VTuber検索フォーム */}
        <TextField
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="推しのVTuberを検索..."
        />
        {/* 候補を表示 */}
        {filteredFaves.length > 0 && (
        <List
          sx={{
          position: 'absolute', // リストを絶対位置にする
          zIndex: 1, // 値を大きくして前面に表示
          width: '40%', // 検索ボックスに合わせてリストの幅を調整
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
        {selectedfaveName && <p>推しのVTuber：{selectedfaveName}</p>}

        {/* 投稿入力フォーム */}
        <StyledTextField
          multiline
          rows={7}
          variant="outlined"
          placeholder="推しコメントを入力"
          value={newPost}
          sx={{ width: '400px' }}
          onChange={(e) => setnewPost(e.target.value)}
        />

      {/* 文字数表示 */}
      <Typography variant="body2" align="right" sx={{ mb: 1 }}>
        {newPost.length}
      </Typography>

      <Divider sx={{ mb: 2 }} />


        {/* エラーメッセージを表示 */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <Box display="flex" justifyContent="space-between">
          {/* 戻るボタン */}
          <Button variant="outlined"  onClick={onClose}>
            戻る
          </Button>

          {/* 投稿ボタン　newPost,selectedfaveId が空の場合に無効化 */}
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={!newPost || !selectedfaveId}
          >
            投稿
          </Button>
        </Box>
    </Box>
  );
}

export default App;
