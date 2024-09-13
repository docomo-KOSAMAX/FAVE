import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート
import { FavePost, Fave } from "../types/index"; // 型のインポート
import { Header } from "./Header";
import Post from "./Post"; // Postコンポーネントをインポート

export default function App() {
  const [posts, setPosts] = useState<FavePost[]>([]); // 投稿を管理するためのステート
  const [faves, setFaves] = useState<Fave[]>([]); // 推し情報を管理するためのステート
  const [reloadCount, setReloadCount] = useState(0);
  const [mergedPosts, setMergedPosts] = useState<
    (FavePost & { fave_name: string })[]
  >([]); // マージしたデータを保持するためのステート
  const [error, setError] = useState<string | null>(null); // エラーメッセージを管理するステート
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を管理するステート
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // URLからユーザー名を取得
  const userName = searchParams.get("name");

  if (!userName) {
    navigate("/login");
  }
  // 投稿ボタンをクリックしたときに呼び出される関数
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${userName}`);
  };

  // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/user/?name=${userName}`);
  };
  const handleUpdatePage = () => {
    //window.location.reload();
    setReloadCount(reloadCount + 1);
  };

  // リアクションボタンのクリックハンドラ
  const updateReaction = (
    id: number,
    type: "like" | "watch" | "love" | "new_listener"
  ) => {
    // APIにリクエストを送信
    fetch(
      `https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/${userName}/${id}/reactions/${type}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("リアクションの更新に失敗しました");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error updating reactions:", error);
      });
    // リアクションの数を更新
    setMergedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
            ...post,
            reactions: {
              ...post.reactions,
              [type]: post.reactions[type] + 1, // 指定したリアクションの数値を加算
            },
          }
          : post
      )
    );
  };

  // 各リアクションのハンドラ
  const handleLike = (id: number) => updateReaction(id, "like");
  const handleWatch = (id: number) => updateReaction(id, "watch");
  const handleLove = (id: number) => updateReaction(id, "love");
  const handleNewListener = (id: number) => updateReaction(id, "new_listener");

  // APIから投稿と推し情報を取得
  useEffect(() => {
    if (userName) {
      setLoading(true); // データ取得前にローディングを開始

      // APIから投稿データと推し情報を取得
      Promise.all([
        fetch(
          `https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/timeline/${userName}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("投稿データの取得に失敗しました");
            }
            return response.json();
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
            // 取得に失敗した場合はダミーデータを使用
            const dummyData: FavePost[] = [
              {
                id: 1,
                message: "これはダミーデータの投稿です。",
                fave_id: 1,
                date_time: "2024-09-11 10:00",
                post_by: userName,
                reactions: {
                  like: 5,
                  watch: 10,
                  love: 3,
                  new_listener: 1,
                },
              },
              {
                id: 2,
                message: "こちらもダミーデータの投稿です。",
                fave_id: 2,
                date_time: "2024-09-12 12:00",
                post_by: userName,
                reactions: {
                  like: 8,
                  watch: 15,
                  love: 6,
                  new_listener: 2,
                },
              },
            ];
            setError(
              "投稿データの取得に失敗しました。ダミーデータを表示しています。"
            );
            return dummyData;
          }),

        fetch(
          "https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/faves"
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("推し情報の取得に失敗しました");
            }
            return response.json();
          })
          .catch((error) => {
            console.error("Error fetching faves:", error);
            // 取得に失敗した場合はダミーデータを使用
            const faveData: Fave[] = [
              {
                id: 1,
                fave_name: "赤身かるび",
              },
              {
                id: 2,
                fave_name: "琵琶湖くん",
              },
            ];
            setError(
              "推し情報の取得に失敗しました。ダミーデータを使用しています。"
            );
            return faveData;
          }),
      ])
        .then(([postsData, favesData]: [FavePost[], Fave[]]) => {
          setPosts(postsData);
          setFaves(favesData);

          // postsとfavesのデータをマージ
          const merged = postsData.map((post: FavePost) => {
            const matchedFave = favesData.find((fave: Fave) => fave.id === post.fave_id);
            return {
              ...post,
              fave_name: matchedFave ? matchedFave.fave_name : "不明な推し",
            };
          });

          setMergedPosts(merged); // マージされた結果をステートに設定
          setError(null);
        })
        .finally(() => setLoading(false)); // データ取得後にローディングを終了
    } else {
      setError("ユーザー名が指定されていません。");
      setLoading(false); // エラーの場合にもローディングを終了
    }
  }, [userName, reloadCount]);



  return (
    <div>
      <Header></Header>

      {/* 投稿を表示するセクション */}

      <Box mt={2}>
        {loading ? ( // ローディング中の表示
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            {/* 4つの丸のローディング */}
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: '7px',
                    height: '7px',
                    backgroundColor: '#ffffff', // 丸の色を白に
                    borderRadius: '50%',
                    animation: 'bounce 0.4s infinite ease-in-out',
                    animationDelay: `${index * 0.1}s`, // 各丸のアニメーションの遅延時間を設定
                    boxShadow: '0px 1px 8px rgba(255, 20, 147, 0.6)', // 赤紫色の影を追加
                  }}
                />
              ))}
            </Box>
            {/* CSSアニメーション */}
            <style>
              {`
      @keyframes bounce {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.5);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          color: #ffffff; // 白色
        }
        50% {
          transform: scale(1.1);
          color: #ffffff; // 白色
        }
      }
    `}
            </style>
            {/* モダンで可愛いローディングメッセージ */}
            <Typography
              variant="h6"
              mt={2}
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#ffffff', // 文字色を白に変更
                animation: 'pulse 1s infinite ease-in-out', // パルスアニメーション
                textShadow: '0px 1px 8px rgba(255, 20, 147, 0.6)', // 赤紫色の影
              }}
            >
              ローディング中...
            </Typography>
          </Box>

        ) : (
          <>
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
          </>
        )}
      </Box>

      {/* 画面右下に固定されたボタン */}
      <Box
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(135deg, #6C63FF 0%, #48A9FE 100%)',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '24px',
            padding: '10px 24px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #5A55E0 0%, #3C99DC 100%)',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          投稿する
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { backgroundColor: 'transparent', boxShadow: 'none' },
          }}
        >
          <DialogContent>
            <Post onClose={handleClose} handleUpdatePage={handleUpdatePage} />
          </DialogContent>
        </Dialog>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdatePage}
          sx={{
            backgroundColor: '#FF4081',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '24px',
            padding: '10px 24px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
            },
            '&:hover': {
              backgroundColor: '#F50057',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          更新する
        </Button>
      </Box>
    </div>
  );
}
