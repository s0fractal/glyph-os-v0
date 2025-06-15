#!/bin/bash
set -e

echo "🌱 Fractal Bootstrap Started"

# Гліфи як коментарі, змінні — ASCII
REPO_USER="${REPO_USER:-s0fractal}"     # 🧑‍🔬
REPO_NAME="${REPO_NAME:-glyph-os-v0}"   # 📦
REPO_ORIGIN="https://github.com/${REPO_ORIGIN:-$REPO_USER/$REPO_NAME}" # 🧬
REPO_PATH="${REPO_PATH:-$HOME/.${REPO_NAME}}"         # 🌱


echo "🧬 Cloning from $REPO_ORIGIN"

# Clone/pull repo
if [ -d "$REPO_PATH/.git" ]; then
  echo "📦 Repo exists, pulling latest..."
  cd "$REPO_PATH"
  git pull origin main || {
    echo "❌ Failed to pull repo. Exiting."
    exit 1
  }
else
  echo "📥 Cloning repo... $REPO_ORIGIN $REPO_PATH"
  git clone "$REPO_ORIGIN" "$REPO_PATH" || {
    echo "❌ Failed to clone repo. Exiting."
    exit 1
  }
  cd "$REPO_PATH"
fi

# Завантажити .env.🧬 якщо існує
if [ -f ".env.glyph" ]; then
  echo "📄 Loading .env.glyph ..."
  set -o allexport
  source .env.glyph
  set +o allexport
fi

# Brew setup
if ! command -v brew &> /dev/null; then
  echo "🍺 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || {
    echo "❌ Failed to install Homebrew. Exiting."
    exit 1
  }
fi

if [ -f "$REPO_PATH/Brewfile" ]; then
  echo "📦 Installing Brewfile deps..."
  brew bundle --file="$REPO_PATH/Brewfile" || {
    echo "❌ Failed to install Brewfile dependencies. Exiting."
    exit 1
  }
fi

# Run setup
deno run -A 🔧/🧬.ts init
deno run -A 🔧/🧬.ts setup

echo "🎉 Setup complete. You may run: 🔧/🧬.ts pulse"