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

  // URLからユーザー名を取得
  const userName = searchParams.get('name');

  // セレクトボックスの値が変更された時のハンドラー
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFave(event.target.value);
  };


      // 取得に失敗した場合はダミーデータを使用
  let faveData = [
    {
      fave_id: 'fave1',
      fave_name: '赤身かるび',
    },
    {
      fave_id: 'fave2',
      fave_name: '琵琶湖くん',
    },
  ];


  // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };

  //投稿ボタンがクリックされた時に呼び出される関数
  const handlePost = () => {
    if (!newPost) return;
    const postid = `post_${Date.now()}`;
    const faveid = `kari_${Date.now()}`;

    const data = {
      id: postid,
      message: newPost,
      fave_id: faveid, 
      date_time: new Date().toISOString(),
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
      setData(response.data);  // サーバーからのレスポンスを使う
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    
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
      
      <Button variant="outlined" onClick={handleNavigateToTimeline}>戻る</Button>
      <select id="dropdown" value={selectedFave} onChange={handleChange}>
      <option value="" disabled>tag</option>
        {Object.values(faveData).map(fave => (
          <option>
            {fave.fave_name}
          </option>
        ))}
      </select>

      <TextField
      label="テキストを入力"
      multiline
      rows={10} // テキストボックスの高さを設定
      fullWidth // 横幅を100%に設定
      variant="outlined" // アウトラインスタイル
      value={newPost}
      onChange={(e) => setnewPost(e.target.value)}
    />
      <Button variant="contained" onClick={() => {handlePost(); handleNavigateToTimeline();}}>投稿</Button>
      
    </div>

  );
}