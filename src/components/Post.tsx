import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export default function App() {
  // ageの状態を管理するためにuseStateを使用
  const [age, setAge] = useState<string>('');

  // セレクトボックスの値が変更されたときに呼び出される関数
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <div>
      <h1>投稿</h1>

      <Button variant="contained">投稿する</Button>
    </div>

  );
}