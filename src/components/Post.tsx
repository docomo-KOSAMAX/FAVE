"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, Button, SelectChangeEvent } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import axios from 'axios';

export default function App() {
  const navigate = useNavigate();
  const [newPost, setnewPost] = useState<string>('');
  const [selectedFave, setSelectedFave] = useState<string>('');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaves, setFilteredFaves] = useState<FaveData[]>([]);
  const [selectedfaveId, setSelectedfaveId] = useState<number | null>(null);
  const [selectedfaveName, setSelectedfaveName] = useState<string | null>(null);

  // URLからユーザー名を取得
  const userName = searchParams.get('name');


  let faveData = [
    {
      "fave_id": 12345,
      "fave_name": '赤身かるび',
    },
    {
      "fave_id": 67890,
      "fave_name": '琵琶湖くん',
    },
    {
      "fave_id":24341,
      "fave_name":"月ノ美兎"
    },
    {
      "fave_id":24342,
      "fave_name":"葛葉"
    },
    {
      "fave_id":24343,
      "fave_name":"本間ひまわり"
    },
    {
      "fave_id":24344,
      "fave_name":"星川サラ"
    }
  ]    

  // console.log(faveData)  

  // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };

  //投稿ボタンがクリックされた時に呼び出される関数
  const handlePost = () => {
    if (!newPost) return;
    if (!selectedfaveId) return;
    
    // ユーザー名をハッシュ化してからタイムスタンプと組み合わせる
    const postid: number = Number(`${hashString(userName)}${Date.now()}`);

    //送信するデータ
    const data = {
      id: postid,
      message: newPost,
      fave_id: selectedfaveId, 
      date_time: new Date(),
      post_by: userName,
      reactions : {
        like: 0,
        watch: 0,
        love: 0,
        new_listener: 0
      }
    };

    console.log(data)

    axios.post(`/api/faveposts/${userName}`, data)
    .then((response) => {

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
   .filter(fave => fave.fave_name.includes(value))
   .slice(0, 5); // 先頭から5件のみ取得
    setFilteredFaves(filtered);
  };

  //候補が選択されたときの処理
  const handleSelect = (fave: FaveData) => {
    setSelectedfaveId(fave.fave_id);
    setSelectedfaveName(fave.fave_name);
    setSearchTerm(''); // 選択後に検索ボックスをクリアする場合
    setFilteredFaves([]); // 選択後に候補を消す場合
  };

  

  return (
    <>
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // 画面全体を占めるように設定
      flexDirection: 'column', // 子要素を縦に並べる
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
      {filteredFaves.map(fave => (
        <li key={fave.fave_id} onClick={() => handleSelect(fave)}>
          {fave.fave_name}
        </li>
      ))}
    </ul>
    {selectedfaveName && (
      <p>選択したVTuber：{selectedfaveName}</p>
    )}

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

      {/* 送信ボタン */}
      <Button variant="contained" onClick={() => {handlePost(); handleNavigateToTimeline();}}>投稿</Button>
      {/* 戻るボタン */}
      <Button variant="outlined" onClick={handleNavigateToTimeline}>戻る</Button>
    

</div>
</>


  );
}

// ハッシュ関数を使用して文字列を数値に変換
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0; // シンプルなハッシュ生成
  }
  return Math.abs(hash); // 負の数を避ける
}