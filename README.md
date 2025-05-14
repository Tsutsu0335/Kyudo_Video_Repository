# Kyudo_Video_Repository
姿勢を確認するためのシステムを開発したいリポジトリ
Vue(nginx)+Express+SQLite+Redis

frontend (port:80,443)  
backend (port:3001)  
redis-server (port:6379)  

## 使い方
### 起動
1. backend/.env, frontend/.endにサーバ情報を設定
2. \$ docker compose up
3. アクセス: https://<自分のアドレス>
4. 初回は登録画面でアカウントを作成してログイン
5. 以降はユーザー名とパスワードでログイン

### 各画面
- Record Posture
  - カメラ映像の録画
- Public Videos
  - 公開設定になっている動画の閲覧
- My Recordings
  - 自分のアカウントのすべての動画を管理
- Real-Time Posture
  - カメラ映像の描画




## 自己署名証明書の準備
\$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/ssl/server.key -out ./nginx/ssl/server.crt -subj "/CN=xxx.xxx.xxx.xxx" (server ip)