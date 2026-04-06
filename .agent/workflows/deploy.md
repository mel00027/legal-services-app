---
description: Deploying LegalClick bot to production VPS with PM2
---
# Deploy LegalClick Bot to Production

## Prerequisites
- VPS with Node.js 18+ and PM2 installed globally (`npm i -g pm2`)
- Git access to the repository
- Telegram bot token from @BotFather

## First-time setup

### 1. Create persistent data directory
```bash
sudo mkdir -p /var/data/legalclick
sudo chown $USER:$USER /var/data/legalclick
```

### 2. Clone and install
```bash
cd /opt
git clone <your-repo-url> legalclick
cd legalclick
npm install
cd server
npm install
cd ..
```

### 3. Configure environment
```bash
cp server/.env.example server/.env
nano server/.env
# Set: BOT_TOKEN, ADMIN_CHAT_ID, DB_PATH=/var/data/legalclick/database.sqlite
```

### 4. Start with PM2 (exponential backoff)
// turbo
```bash
pm2 start ecosystem.config.js
```

### 5. Save PM2 process list
// turbo
```bash
pm2 save
```

### 6. Enable PM2 startup on server reboot
```bash
pm2 startup
# PM2 will print a command like: sudo env PATH=... pm2 startup systemd ...
# Copy and run that command!
```

### 7. Verify
// turbo
```bash
pm2 list
pm2 logs legalclick-bot --lines 20
```

## Updating (new deploy from GitHub)

### Pull new code and restart
```bash
cd /opt/legalclick
git pull origin main
npm install
cd server && npm install && cd ..
pm2 restart legalclick-bot
pm2 save
```

> **IMPORTANT:** The database at `/var/data/legalclick/database.sqlite` will NOT be affected by `git pull` since it's outside the code directory. Client history is preserved forever.

## Useful PM2 commands
- `pm2 list` — see running processes
- `pm2 logs legalclick-bot` — live logs
- `pm2 monit` — real-time monitoring dashboard
- `pm2 restart legalclick-bot` — restart bot
- `pm2 stop legalclick-bot` — stop bot
- `pm2 delete legalclick-bot` — remove from PM2

## Troubleshooting
- If bot keeps crashing: `pm2 logs legalclick-bot --err --lines 50`
- Check DB path: `ls -la /var/data/legalclick/`
- Verify env: `pm2 env legalclick-bot`
