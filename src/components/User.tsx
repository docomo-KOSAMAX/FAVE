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
      <h1>ユーザー画面
      </h1>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained">投稿する</Button>
    </div>

  );
}