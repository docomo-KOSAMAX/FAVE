import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// タイムライン要素の型定義
type Post = {
  id: string;
  message: string;
  fave_id: string;
  date_time: string;
  fave_name: string;
  reactions: {
    like: number;
    watch: number;
    love: number;
    new_listener: number;
  };
};

// TimelineElementコンポーネントのプロパティ型定義
interface TimelineElementProps {
  post: Post;
  error?: string | null;
  onLike: (id: string) => void;
  onWatch: (id: string) => void;
  onLove: (id: string) => void;
  onNewListener: (id: string) => void;
}

// タイムライン要素コンポーネント
const TimelineElement: React.FC<TimelineElementProps> = ({
  post,
  error,
  onLike,
  onWatch,
  onLove,
  onNewListener,
}) => {
  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Box mb={3} p={2} border={1} borderRadius={2} boxShadow={2} bgcolor="background.paper">
      {/* タイトルと投稿日を同じ行に配置 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <Typography variant="h6">
          <span style={{ fontSize: '0.75em' }}>Vtuber名:</span> {post.fave_name}
        </Typography>
        <Box textAlign="right">
          {/* 投稿者と投稿日を表示 */}
          <Typography variant="body2">{post.date_time}</Typography>
        </Box>
      </Box>
      <Typography>{post.message}</Typography>
      <Box mt={1}>
        {/* リアクションボタン */}
        <Button variant="outlined" size="small" onClick={() => onLike(post.id)}>
          👍 いいね: {post.reactions.like}
        </Button>{' '}
        <Button variant="outlined" size="small" onClick={() => onWatch(post.id)}>
          👀 見たよ: {post.reactions.watch}
        </Button>{' '}
        <Button variant="outlined" size="small" onClick={() => onLove(post.id)}>
          💘 好き: {post.reactions.love}
        </Button>{' '}
        <Button variant="outlined" size="small" onClick={() => onNewListener(post.id)}>
          🆕 リスナーになったよ！: {post.reactions.new_listener}
        </Button>
      </Box>
    </Box>
  );
};

export default TimelineElement;
