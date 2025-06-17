#!/bin/bash

# === 1. Встановлення Cloudflared (якщо ще не встановлений) ===
if ! command -v cloudflared &> /dev/null; then
  echo "🧪 Installing cloudflared via Homebrew..."
  brew install cloudflared
else
  echo "✅ cloudflared already installed."
fi

# === 2. Авторизація через Cloudflare (відкриє браузер) ===
echo "🌐 Logging into Cloudflare (вибери домен s0fractal.me)..."
cloudflared login

# === 3. Створення тунелю з іменем glf-mac-agent ===
echo "🚇 Creating tunnel: glf-mac-agent..."
cloudflared tunnel create glf-mac-agent

# === 4. Маршрутизація DNS — додаємо сабдомен glf-mac.s0fractal.me ===
echo "🌍 Routing DNS glf-mac.s0fractal.me..."
cloudflared tunnel route dns glf-mac-agent glf-mac.s0fractal.me

# === 5. Створення конфігураційного файлу ===
echo "🧩 Writing config file..."
mkdir -p ~/.cloudflared

cat <<EOF > ~/.cloudflared/config.yml
tunnel: glf-mac-agent
credentials-file: /Users/$(whoami)/.cloudflared/glf-mac-agent.json

ingress:
  - hostname: glf-mac.s0fractal.me
    service: http://localhost:3000
  - service: http_status:404
EOF

echo "📄 ~/.cloudflared/config.yml created."

# === 6. Запуск тунелю ===
echo "🚀 Running tunnel... (you can stop with Ctrl+C)"
cloudflared tunnel run glf-mac-agent