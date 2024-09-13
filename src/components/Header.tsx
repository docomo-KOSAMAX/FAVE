import React from "react";
import { Button, AppBar, Box } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
//   children?: React.ReactElement<any>;
// }

// function HideOnScroll(props: Props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({
//     target: window ? window() : undefined,
//   });

//   return (
//     <Slide appear={false} direction="down" in={!trigger}>
//       {children ?? <div />}
//     </Slide>
//   );
// }

export const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URLからユーザー名を取得
  const userName = searchParams.get("name");
  const pathname = useLocation().pathname;

  const isTimeline = pathname === `/timeline/` && true;
  const isUserPage = pathname === `/user/` && true;
  const MoveToTimeline = () => {
    // console.log("timeline");
    navigate(`/timeline/?name=${userName}`);
  };

  const MoveToUserPage = () => {
    // console.log("User");
    navigate(`/user/?name=${userName}`);
  };
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // すりガラス風の白い背景
        backdropFilter: 'blur(10px)', // 背景のぼかし効果
        borderRadius: '0 0 15px 15px', // 上の角を丸くしない
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 柔らかい影
        overflow: 'hidden', // 丸みをボタンに適用するためにoverflowを隠す
      }}
    >
      <Box
        sx={{
          display: 'flex', // Flexboxで横並び
          flexDirection: 'row',
          height: '60px', // ヘッダーの高さを小さく
        }}
      >
        <Button
          sx={{
            fontSize: 20, // フォントサイズを少し小さく
            fontFamily: 'inherit',
            fontWeight: 700,
            width: '50%',
            height: '100%',
            backgroundColor: isTimeline ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)', // ボタンのすりガラス風の背景
            color: isTimeline ? '#9966FF' : 'rgba(100, 100, 100, 0.7)', // 選択されていない場合はグレーの色
            borderBottom: isTimeline ? '4px solid #9966FF' : 'none',
            boxShadow: 'none', // 一体化するために影を削除
            borderRadius: '0', // ボタンの角丸を削除
            outline: 'none', // 選択時の枠線を非表示
            transition: 'background-color 0.3s, color 0.3s', // ホバー時のアニメーション（拡大を削除）
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // ホバー時に少し濃く
              color: isTimeline ? '#9966FF' : '#666666', // ホバー時の文字色
            },
            '&:focus': {
              outline: 'none', // フォーカス時も枠線を非表示
            },
          }}
          onClick={MoveToTimeline}
        >
          タイムライン
        </Button>
        <Button
          sx={{
            fontSize: 20, // フォントサイズを少し小さく
            fontFamily: 'inherit',
            fontWeight: 700,
            width: '50%',
            height: '100%',
            backgroundColor: isUserPage ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)', // ボタンのすりガラス風の背景
            color: isUserPage ? '#9966FF' : 'rgba(100, 100, 100, 0.7)', // 選択されていない場合はグレーの色
            borderBottom: isUserPage ? '4px solid #9966FF' : 'none',
            boxShadow: 'none', // 一体化するために影を削除
            borderRadius: '0', // ボタンの角丸を削除
            outline: 'none', // 選択時の枠線を非表示
            transition: 'background-color 0.3s, color 0.3s', // ホバー時のアニメーション（拡大を削除）
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // ホバー時に少し濃く
              color: isUserPage ? '#9966FF' : '#666666', // ホバー時の文字色
            },
            '&:focus': {
              outline: 'none', // フォーカス時も枠線を非表示
            },
          }}
          onClick={MoveToUserPage}
        >
          ユーザー
        </Button>
      </Box>
    </AppBar>

  );
};
