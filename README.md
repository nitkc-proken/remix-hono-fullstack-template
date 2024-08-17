# 開発者向けドキュメント
[Docs](/docs/README.md)を参照

# 準備

## 依存パッケージのインストール
```sh
pnpm i
pnpm lefthook install
```
## .env.exampleのコピー
```sh
cd apps/api
cp .env.example .env
```
```sh
cd apps/remix
cp .env.example .env
```

# スタート
## フロントエンド(remix)のみ起動
```sh
cd apps/remix
pnpm dev
```
## バックエンド(api)のみ起動
```sh
cd apps/api
pnpm dev
```
## 両方起動
```sh
pnpm dev
```