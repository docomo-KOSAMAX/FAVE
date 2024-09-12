export type FavePost = {
  id: number; // postのid
  message: string; // 推しポイント説明
  fave_id: number; // 推しのid (Favesテーブル)
  date_time: string; // 投稿日時
  post_by: string; // ポストした人のid (Usersテーブル)
  reactions: {
    like: number; // いいね👍した人の数
    watch: number; // 見たよ👀した人の数
    love: number; // 好き💘した人の数
    new_listener: number; // リスナーになったよ！した人の数
  };
};

export type Fave = {
  id: number; // 推しのid (Favesテーブル)
  fave_name: string; // 推しの名前
};
