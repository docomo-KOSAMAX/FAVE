import { useState, useEffect } from "react";
import { Button, Box, Typography, CircularProgress, Dialog, DialogContent } from "@mui/material"; // CircularProgressをインポート
import { useNavigate, useSearchParams } from "react-router-dom";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート
import { FavePost, Fave } from "../types/index"; // 型のインポート
import { Header } from "./Header";
import Post from './Post'; // Postコンポーネントをインポート

export default function User() {
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

  // 投稿ボタンをクリックしたときに呼び出される関数
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${userName}`);
  };

  // タイムラインボタンをクリックしたときに呼び出される関数
  const handleNavigateToTimeline = () => {
    navigate(`/?name=${userName}`);
  };
  const handleUpdatePage = () => {
    // window.location.reload();
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
                [type]: post.reactions[type as keyof FavePost["reactions"]] + 1, // 指定したリアクションの数値を加算
              },
            }
          : post
      )
    );
  };

  // 投稿の削除ボタンのクリックハンドラ
  const handleDelete = (id: number) => {
    fetch(
      `https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/${userName}/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("投稿の削除に失敗しました");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        setError("投稿の削除に失敗しました");
      });
    // 削除が成功したら、ステートから削除された投稿を取り除く
    setMergedPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
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
      fetch(
        `https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/favePosts/${userName}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("投稿データの取得に失敗しました");
          }
          return response.json();
        })
        .then((data: FavePost[]) => {
          setPosts(data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          const dummyData: FavePost[] = [
            {
              id: 1,
              message: "推しの歌声が毎日の活力！この曲を聴くと元気が出ます！",
              fave_id: 1,
              date_time: "2024-09-11 10:00",
              post_by: userName || "",
              reactions: {
                like: 5,
                watch: 10,
                love: 3,
                new_listener: 1,
              },
            },
            {
              id: 2,
              message: "推しのゲーム実況、本当に面白い！もっとたくさん見たい！",
              fave_id: 2,
              date_time: "2024-09-12 12:00",
              post_by: userName || "",
              reactions: {
                like: 8,
                watch: 15,
                love: 6,
                new_listener: 2,
              },
            },
          ];
          setPosts(dummyData);
          setError(
            "投稿データの取得に失敗しました。ダミーデータを表示しています。"
          );
        })
        .finally(() => setLoading(false)); // データ取得後にローディングを終了

      fetch(
        "https://t8vrh2rit7.execute-api.ap-northeast-1.amazonaws.com/test/api/faves"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("推し情報の取得に失敗しました");
          }
          return response.json();
        })
        .then((data: Fave[]) => {
          setFaves(data);
        })
        .catch((error) => {
          console.error("Error fetching faves:", error);
          const faveData: Fave[] = [
            {
              id: 1,
              fave_name: "サンプル1",
            },
            {
              id: 2,
              fave_name: "サンプル2",
            },
          ];
          setFaves(faveData);
          setError(
            "推し情報の取得に失敗しました。ダミーデータを使用しています。"
          );
        });
    } else {
      setError("ユーザー名が指定されていません。");
      setLoading(false); // エラーの場合にもローディングを終了
    }
  }, [userName, reloadCount]);

  // 投稿と推し情報をマージしてfave_nameを追加
  useEffect(() => {
    if (posts.length > 0 && faves.length > 0) {
      const merged = posts.map((post) => {
        console.log(post.fave_id);
        const matchedFave = faves.find(
          (fave) => Number(fave.id) === Number(post.fave_id)
        );
        return {
          ...post,
          fave_name: matchedFave ? matchedFave.fave_name : "不明な推し",
        };
      });

      setMergedPosts(merged);
    }
  }, [posts, faves]);

  return (
    <div>
      {/* タイトルを上部に固定 */}
      <Header></Header>
      <Box mt={2} mb={2} textAlign="center">
        <Typography
          variant="h5"
          align="center"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // 背景色を白に設定（透明度を調整）
            backdropFilter: 'blur(10px)', // 背景のぼかし効果
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)', // 全方向に影を追加
            display: 'inline-block', // 背景色がテキストにフィットするように設定
            padding: '8px 16px', // パディングを追加して余白を作成
            borderRadius: '8px', // 角を丸める
          }}
        >
          あなた({userName})の投稿です
        </Typography>
      </Box>


      {/* 投稿を表示するセクション */}
      <Box mt={2}>
        {loading ? ( // ローディング中の表示
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <CircularProgress /> {/* ローディングスピナーを表示 */}
            <Typography variant="h6" mt={2}>
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
                onDelete={handleDelete} // 削除ハンドラを追加
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
          <Post onClose={handleClose} handleUpdatePage={handleUpdatePage}/>
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
