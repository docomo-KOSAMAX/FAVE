import React from "react";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fave } from '../types/index'; // 型のインポート

import axios from "axios";

export default function App() {
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
  // 必要に応じて、他のデフォルト設定も追加できます
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

    // ユーザー名をハッシュ化してからタイムスタンプと組み合わせる
    let postid: number = 0;
    if (userName !== null) {
      postid = Number(`${hashString(userName)}${Date.now()}`);
    } else { 
      console.error("ユーザー名が取得できません");
      return;
    }

    //送信するデータ
    const data = {
      id: postid,
      message: newPost,
      fave_id: selectedfaveId,
      date_time: new Date(),
      post_by: userName,
      reactions: {
        like: 0,
        watch: 0,
        love: 0,
        new_listener: 0,
      },
    };

    console.log(data);

    axios
      api.post(`/api/favePosts/${userName}`, data)
      .then((response) => {
        console.log("Post successful:", response);
        // 投稿が成功したらタイムラインに遷移
        console.log("Post successful:", response);
        console.log("Status Code:", response.status); // ステータスコードをログに出力
        handleNavigateToTimeline();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //検索ボックスの値が変更されたときのハンドラー
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 入力に基づいて候補をフィルタリングし、最大5件まで表示する
    const filtered = faveData
      .filter((fave) => fave.fave_name.includes(value))
      .slice(0, 5); // 先頭から5件のみ取得
    setFilteredFaves(filtered);
  };

  //候補が選択されたときの処理
  const handleSelect = (fave: Fave) => {
    setSelectedfaveId(fave.id);
    setSelectedfaveName(fave.fave_name);
    setSearchTerm(""); // 選択後に検索ボックスをクリアする場合
    setFilteredFaves([]); // 選択後に候補を消す場合
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // 画面全体を占めるように設定
          flexDirection: "column", // 子要素を縦に並べる
        }}
      >
        <h2>投稿</h2>

        {/* VTuber検索フォーム */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="検索..."
        />
        <ul>
          {filteredFaves.map((fave) => (
            <li key={fave.id} onClick={() => handleSelect(fave)}>
              {fave.fave_name}
            </li>
          ))}
        </ul>
        {selectedfaveName && <p>選択したVTuber：{selectedfaveName}</p>}

        {/* 投稿入力フォーム */}
        <TextField
          label="テキストを入力"
          multiline
          rows={10} // テキストボックスの高さを設定
          fullWidth // 横幅を100%に設定
          variant="outlined" // アウトラインスタイル
          value={newPost}
          onChange={(e) => setnewPost(e.target.value)}
        />

        {/* エラーメッセージを表示 */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* 投稿ボタン　newPost,selectedfaveId が空の場合に無効化 */}
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!newPost || !selectedfaveId}
        >
          投稿
        </Button>
        {/* 戻るボタン */}
        <Button variant="outlined" onClick={handleNavigateToTimeline}>
          戻る
        </Button>
      </div>
    </>
  );
}

// ハッシュ関数を使用して文字列を数値に変換
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0; // シンプルなハッシュ生成
  }
  return Math.abs(hash); // 負の数を避ける
}
