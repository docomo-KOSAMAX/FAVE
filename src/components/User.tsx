import { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TimelineElement from './TimelineElement'; // コンポーネントのインポート
import { FavePost, Fave } from '../types/index'; // 型のインポート

export default function User() {
  const [posts, setPosts] = useState<FavePost[]>([]); // 投稿を管理するためのステート
  const [faves, setFaves] = useState<Fave[]>([]); // 推し情報を管理するためのステート
  const [mergedPosts, setMergedPosts] = useState<(FavePost & { fave_name: string })[]>([]); // マージしたデータを保持するためのステート
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

  // リアクションボタンのクリックハンドラ
  const updateReaction = (id: number, type: 'like' | 'watch' | 'love' | 'new_listener') => {
    // APIにリクエストを送信
    fetch(`https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/${userName}/${id}/reactions/${type}`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('リアクションの更新に失敗しました');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error updating reactions:', error);
      });

    // リアクションの数を更新
    setMergedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
            ...post,
            reactions: {
              ...post.reactions,
              [type]: post.reactions[type as keyof FavePost['reactions']] + 1, // 指定したリアクションの数値を加算
            },
          }
          : post
      )
    );
  };

  // 各リアクションのハンドラ
  const handleLike = (id: number) => updateReaction(id, 'like');
  const handleWatch = (id: number) => updateReaction(id, 'watch');
  const handleLove = (id: number) => updateReaction(id, 'love');
  const handleNewListener = (id: number) => updateReaction(id, 'new_listener');

  // APIから投稿と推し情報を取得
  useEffect(() => {
    if (userName) {
      // APIから投稿データを取得
      //fetch(`/api/favePosts/${userName}`)
      fetch(`https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/timeline/huga`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('投稿データの取得に失敗しました');
          }
          return response.json();
        })
        .then((data: FavePost[]) => {
          setPosts(data);
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          // 取得に失敗した場合はダミーデータを使用
          const dummyData: FavePost[] = [
            {
              id: 1,
              message: '推しの歌声が毎日の活力！この曲を聴くと元気が出ます！',
              fave_id: 1,
              date_time: '2024-09-11 10:00',
              post_by: userName || '',
              reactions: {
                like: 5,
                watch: 10,
                love: 3,
                new_listener: 1,
              },
            },
            {
              id: 2,
              message: '推しのゲーム実況、本当に面白い！もっとたくさん見たい！',
              fave_id: 2,
              date_time: '2024-09-12 12:00',
              post_by: userName || '',
              reactions: {
                like: 8,
                watch: 15,
                love: 6,
                new_listener: 2,
              },
            },
            // 他のダミーデータも追加
          ];
          setPosts(dummyData);
          setError('投稿データの取得に失敗しました。ダミーデータを表示しています。');
        });

      // APIから推し情報を取得
      fetch('https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/faves')
        .then((response) => {
          if (!response.ok) {
            throw new Error('推し情報の取得に失敗しました');
          }
          return response.json();
        })
        .then((data: Fave[]) => {
          setFaves(data);
        })
        .catch((error) => {
          console.error('Error fetching faves:', error);
          // 取得に失敗した場合はダミーデータを使用
          const faveData: Fave[] = [
            {
              id: 1,
              fave_name: 'サンプル1',
            },
            {
              id: 2,
              fave_name: 'サンプル2',
            },
          ];
          setFaves(faveData);
          setError('推し情報の取得に失敗しました。ダミーデータを使用しています。');
        });
    } else {
      setError('ユーザー名が指定されていません。');
    }
  }, [userName]);

  // 投稿と推し情報をマージしてfave_nameを追加
  useEffect(() => {
    if (posts.length > 0 && faves.length > 0) {
      // postsとfavesのデータをマージ
      const merged = posts.map((post) => {
        // 対応するfave_nameを見つける
        //それぞれのfave_idを確認する
        console.log(post.fave_id)
        const matchedFave = faves.find((fave) => Number(fave.id) === Number(post.fave_id)); // 型を一致させる
        return {
          ...post,
          fave_name: matchedFave ? matchedFave.fave_name : '不明な推し', // 見つからなければデフォルト値を使用
        };
      });

      setMergedPosts(merged); // マージされた結果をステートに設定
    }
  }, [posts, faves]);


  return (
    <div>
      <h1>{userName}の投稿</h1>

      {/* 投稿を表示するセクション */}
      <Box mt={4}>
        {error && (
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        )}
        {mergedPosts.map((post) => (
          <TimelineElement
            key={post.id}
            post={post}
            onLike={handleLike}
            onWatch={handleWatch}
            onLove={handleLove}
            onNewListener={handleNewListener}
          />
        ))}
      </Box>

      {/* 画面右下に固定されたボタン */}
      <Box
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
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
