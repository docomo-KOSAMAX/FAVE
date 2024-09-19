# 布教特化型Vtuberプラットフォーム「FAVE」
https://github.com/user-attachments/assets/aa1f095f-f84e-49ab-a0a6-d2b2f6ca9206

## 概要

[ドコモハッカソン](https://information.nttdocomo-fresh.jp/event/hackathon/)\(2024/9/10-2024/9/13\) 最優秀賞受賞作品

私たちのプラットフォームでは、以下の特徴を持つサービスを提供します：

- **推しを推し合う**：ファン同士でVtuberの魅力を相互に共有。
- **匿名投稿**：投稿者の情報よりも、「誰推し」であるかを重要視。
- **豊富なレスポンス**：布教活動の成功を実感できるシステム。
- **推しポイントの共有**：同じ趣味を持つファン同士がつながる場所を提供。

## アーキテクチャ
![AWS drawio_1](https://github.com/user-attachments/assets/c7e8e32b-4dce-4ed7-b760-6595ec787c36)

## 技術スタック

### フロントエンド
- **React (TypeScript)**: 表示コメント・ヘッダーをコンポーネント化し、複数ページで再利用。
- **Material UI**: モダンでTwitterライクなデザイン。
- **React Router**: ページごとのルーティング。
- **Git・GitHub**: GitHub Actionsを利用して、自動デプロイ。

### バックエンド
- **AWS**: Lambda, API Gateway, bedrock, EventBridge, Aurora Serverless
- **Python**: サーバーサイドロジックの実装。
- **PostgreSQL**: データベース。

### ER図
![image (2)](https://github.com/user-attachments/assets/04890261-bcfc-4e20-9493-5742628c0d68)


## 制作
チーム KOSAMAX
