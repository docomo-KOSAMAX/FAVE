import React, { useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import useInView from '../hooks/useInView'; // カスタムフックをインポート

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

type Post = {
  id: number;
  message: string;
  fave_id: number;
  date_time: string;
  fave_name: string;
  reactions: {
    like: number;
    watch: number;
    love: number;
    new_listener: number;
  };
};

interface TimelineElementProps {
  post: Post;
  error?: string | null;
  onLike?: (id: number) => void;
  onWatch?: (id: number) => void;
  onLove?: (id: number) => void;
  onNewListener?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const TimelineElement: React.FC<TimelineElementProps> = ({
  post,
  error,
  onLike,
  onWatch,
  onLove,
  onNewListener,
  onDelete,
}) => {
  const { ref, isInView } = useInView(); // カスタムフックを使用

  // isInViewの状態変化を監視し、デバッグ用のログを追加
  useEffect(() => {
    console.log('isInView changed:', isInView);
  }, [isInView]);

  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Box
      ref={ref}
      mb={3}
      p={2}
      borderRadius={2}
      bgcolor="rgba(255, 255, 255, 0.7)"
      position="relative"
      sx={{
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
      }}
    >
      {/* タイトルと投稿日を同じ行に配置 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {post.fave_name} <span style={{ fontSize: '0.75em' }}>推し</span>
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" mr={1} color="text.secondary">
            {formatDateTime(post.date_time)}
          </Typography>
          {onDelete && (
            <IconButton
              color="error"
              onClick={() => onDelete(post.id)}
              sx={{
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      {/* メッセージ部分に余白を追加してボタンと重ならないようにする */}
      <Typography mt={1} mb={4}>
        {post.message}
      </Typography>
      <Box position="absolute" bottom={8} right={8} display="flex" gap={1}>
        {/* リアクションアイコンボタン */}
        <Tooltip title="いいね">
          <IconButton
            color="primary"
            onClick={() => onLike?.(post.id)}
            disabled={!onLike}
            size="small"
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            <ThumbUpAltIcon fontSize="small" />
            <Typography variant="caption" ml={0.5}>
              {post.reactions.like}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="見たよ">
          <IconButton
            color="info"
            onClick={() => onWatch?.(post.id)}
            disabled={!onWatch}
            size="small"
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
            <Typography variant="caption" ml={0.5}>
              {post.reactions.watch}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="好き">
          <IconButton
            color="secondary"
            onClick={() => onLove?.(post.id)}
            disabled={!onLove}
            size="small"
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            <FavoriteIcon fontSize="small" />
            <Typography variant="caption" ml={0.5}>
              {post.reactions.love}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="リスナーになったよ！">
          <IconButton
            color="success"
            onClick={() => onNewListener?.(post.id)}
            disabled={!onNewListener}
            size="small"
            sx={{
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            <PersonAddIcon fontSize="small" />
            <Typography variant="caption" ml={0.5}>
              {post.reactions.new_listener}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TimelineElement;
