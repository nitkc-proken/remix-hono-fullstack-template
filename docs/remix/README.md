# remix (フロントエンド)
## scripts
### 開発環境の起動
```sh
pnpm dev
```
### ビルド
```sh
pnpm build
```

## 使用している技術
- [React](https://reactjs.org/)
- [Remix](https://remix.run/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
  - 詳細は [shadcn.md](./shadcn.md) を参照
- [Vite](https://vitejs.dev/)
- [pnpm](https://pnpm.io/)
- ...

## 基本ファイル構成
一部省略
```sh
apps/remix/
├── app/ # Remixのコード
│   ├── @types/ # daclareなどの型定義 基本こっちには書かない
│   ├── components/ # コンポーネント
│   ├── lib/ # ライブラリ
│   │   ├── repositories/ # リポジトリ(後で詳しく説明)
│   │   ├── types/ # 型定義
│   │   └── utils/ # 汎用的に使えるもの
│   ├── routes/ # ルーティング
│   │   ├── _index.tsx # /で表示されるページ
│   │   ├── example._index.tsx # /exampleで表示されるページ
│   │   └── example.new.tsx # /example/newで表示されるページ
│   ├── global.css # グローバルに適用されるCSS
│   └── root.tsx # Root(すべての元)のコンポーネント
├── .env.example # 環境変数のサンプル
├── .gitignore # 除外されるファイル
├── components.json # shadcn/uiの設定
├── package.json # パッケージ情報
├── postcss.config.js # PostCSSの設定
├── tailwind.config.ts # TailwindCSSの設定
├── tsconfig.json # TypeScriptの設定
└── vite.config.ts # Vite(バンドラー)の設定
```
基本的にみんながいじるのは、app/以下のファイルになると思う。特にroutes/やcomponents/。

app/routes/以下でルーティングを定義する。
つまり、どこにアクセスしたらなにが表示されるのかを定義する。
Remixではファイルの名前によってルーティングが決まる。
https://zenn.dev/heysya_onsya/articles/5aae742104b32a が参考になる。

## リポジトリ(Repository)
言葉の意味としてリポジトリはデータの永続化を行うやつのこと。

Git/GitHubのリポジトリとは異なるので注意。

今回、バックエンドに縛られない開発をするためにリポジトリの概念を導入してみている。

APIと実際に通信するメイン実装と、APIの挙動を模倣するモック実装を分けることで、バックエンドの実装ができる前にフロントエンドの開発を進めることができる。

詳細は [リポジトリ](./repository.md) を参照

## RPC (Remote Procedure Call)

今回のプロジェクトでは、APIとの通信でRPCという技術を使えるようにしている。RPCを使うとAPIをあたかもただの関数呼び出しのように扱うことができる。

```ts
import { rpc } from "~/lib/utils/hc";
// /api/example/tasksにGETリクエストを送る
const response = await rpc.api.example.tasks.$get();
// 結果を取得
const result = await res.json();
```

型も自動で生成されるので、型安全にAPIを叩くことができる。




