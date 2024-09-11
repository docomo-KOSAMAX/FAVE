import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TimelineElement from './TimelineElement'; // コンポーネントのインポート

export default function App() {
  const [age, setAge] = useState<string>('');
  const [posts, setPosts] = useState<any[]>([]); // 投稿を管理するためのステート
  const [error, setError] = useState<string | null>(null); // エラーメッセージを管理するステート
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URLからユーザー名を取得
  const userName = searchParams.get('name');

  // 投稿ボタンをクリックしたときに呼び出される関数
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${userName}`);
  };

  // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };

  // APIから投稿を取得する代わりにダミーデータを使用
  useEffect(() => {
    if (userName) {
      // ダミーデータの定義
      const dummyData = [
        {
          id: '1',
          message: 'これはダミーデータの投稿です。',
          fave_id: 'fave1',
          date_time: '2024-09-11 10:00',
          post_by: userName,
          reactions: {
            like: 5,
            watch: 10,
            love: 3,
            new_listner: 1,
          },
        },
        {
          id: '2',
          message: 'こちらもダミーデータの投稿です。',
          fave_id: 'fave2',
          date_time: '2024-09-12 12:00',
          post_by: userName,
          reactions: {
            like: 8,
            watch: 15,
            love: 6,
            new_listner: 2,
          },
        },
      ];

      // ダミーデータを使用して投稿を設定
      setPosts(dummyData);
      setError(null); // エラーメッセージをクリア
    } else {
      setError('ユーザー名が指定されていません。');
    }
  }, [userName]);

  return (
    <div>
      <h1>ユーザー画面</h1>

      {/* 投稿を表示するセクション */}
      <Box mt={4}>
        {error ? (
          // エラーメッセージを表示
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        ) : (
          posts.map((post) => (
            <TimelineElement key={post.id} post={post} />
          ))
        )}
      </Box>

      {/* 画面右下に固定されたボタン */}
      <Box
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'row',
          gap: '8px', // ボタン間のスペース
        }}
      >
        <Button variant="contained" color="primary" onClick={handleNavigateToPost}>
          投稿する
        </Button>
        <Button variant="contained" color="secondary" onClick={handleNavigateToTimeline}>
          タイムライン画面へ
        </Button>
      </Box>
    </div>
  );
}
