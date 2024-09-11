import React from 'react';
import { Box, Typography } from '@mui/material';

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
    new_listner: number;
  };
};

// TimelineElementコンポーネントのプロパティ型定義
interface TimelineElementProps {
  post: Post;
  error?: string | null;
}

// タイムライン要素コンポーネント
const TimelineElement: React.FC<TimelineElementProps> = ({ post, error }) => {
  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Box mb={3} p={2} border={1} borderRadius={2} boxShadow={2}>
      <Typography variant="h6">Vtuber名: {post.fave_name}</Typography>
      <Typography>{post.message}</Typography>
      <Typography variant="body2">投稿日: {post.date_time}</Typography>
      <Box mt={1}>
        <Typography variant="caption">👍 いいね: {post.reactions.like}</Typography> |{' '}
        <Typography variant="caption">👀 見たよ: {post.reactions.watch}</Typography> |{' '}
        <Typography variant="caption">💘 好き: {post.reactions.love}</Typography> |{' '}
        <Typography variant="caption">🆕 リスナーになったよ！: {post.reactions.new_listner}</Typography>
      </Box>
    </Box>
  );
};

export default TimelineElement;
