"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function App() {
  // ageの状態を管理するためにuseStateを使用
  const [age, setAge] = useState<string>('');
  const navigate = useNavigate();
  const [newPost, setnewPost] = useState<string>('');
  const name = "name"

  
  // セレクトボックスの値が変更されたときに呼び出される関数
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

    // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/`);
  };

  //投稿ボタンがクリックされた時に呼び出される関数
  const handlePost = () => {

  };

  const addPost = async () => {
    
  }


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