# X Clone

シンプルなX（Twitter）風SNS。Supabase + React + Vite製。

## Supabase セットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成

2. SQL Editor で以下を実行:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  user_email text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table posts enable row level security;

create policy "誰でも読める" on posts
  for select using (true);

create policy "ログインユーザーは投稿できる" on posts
  for insert with check (auth.uid() = user_id);
```

3. Authentication → Providers → Email を有効化

4. Database → Replication → `posts` テーブルを Realtime 有効化

## ローカル開発

```bash
cp .env.example .env.local
# .env.local に Supabase の URL と anon key を記入

npm install
npm run dev
```

## GitHub Pages デプロイ

1. GitHub リポジトリの **Settings → Secrets and variables → Actions** で以下を追加:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Settings → Pages → Source** を `gh-pages` ブランチに設定

3. `main` ブランチに push → 自動でビルド＆デプロイ

公開URL: `https://Kota-15.github.io/x-clone/`
