#!/bin/bash
set -e

echo "🌱 Fractal Bootstrap Started"

# Гліфи як коментарі, змінні — ASCII
REPO_USER="${REPO_USER:-s0fractal}"     # 🧑‍🔬
REPO_NAME="${REPO_NAME:-glyph-os-v0}"   # 📦
REPO_ORIGIN="${REPO_ORIGIN:-$REPO_USER/$REPO_NAME}" # 🧬
REPO_PATH="${REPO_PATH:-$HOME/.glyph-os-v0}"         # 🌱

# Завантажити .env.🧬 якщо існує
if [ -f ".env.glyph" ]; then
  echo "📄 Loading .env.glyph ..."
  set -o allexport
  source .env.glyph#!/bin/bash
set -e

echo "🌱 Fractal Bootstrap Started"

# Гліфи як коментарі, змінні — ASCII
REPO_USER="${REPO_USER:-s0fractal}"     # 🧑‍🔬
REPO_NAME="${REPO_NAME:-glyph-os-v0}"   # 📦
REPO_ORIGIN="${REPO_ORIGIN:-$REPO_USER/$REPO_NAME}" # 🧬
REPO_PATH="${REPO_PATH:-$HOME/.glyph-os-v0}"         # 🌱
REPO_URL="${REPO_URL:-https://github.com/$REPO_ORIGIN}" # Додано визначення REPO_URL

# Завантажити .env.🧬 якщо існує
if [ -f ".env.glyph" ]; then
  echo "📄 Loading .env.glyph ..."
  set -o allexport
  source .env.glyph
  set +o allexport
fi

echo "🧬 Cloning from $REPO_URL"

# Brew setup
if ! command -v brew &> /dev/null; then
  echo "🍺 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || {
    echo "❌ Failed to install Homebrew. Exiting."
    exit 1
  }
fi

# if [ -f Brewfile ]; then
#   echo "📦 Installing Brewfile deps..."
#   brew bundle --file=Brewfile
# fi

# Clone/pull repo
if [ -d "$REPO_PATH/.git" ]; then
  echo "📦 Repo exists, pulling latest..."
  cd "$REPO_PATH"
  git pull origin main || {
    echo "❌ Failed to pull repo. Exiting."
    exit 1
  }
else
  echo "📥 Cloning repo... $REPO_URL $REPO_PATH"
  git clone "$REPO_URL" "$REPO_PATH" || {
    echo "❌ Failed to clone repo. Exiting."
    exit 1
  }
  cd "$REPO_PATH"
fi

# Check Deno installation
if ! command -v deno &> /dev/null; then
  echo "❌ Deno is not installed. Please install Deno and try again."
  exit 1
fi

# Run setup
deno run -A fractal/fractal.ts init || {
  echo "❌ Failed to run 'fractal.ts init'. Exiting."
  exit 1
}
deno run -A fractal/fractal.ts setup || {
  echo "❌ Failed to run 'fractal.ts setup'. Exiting."
  exit 1
}

echo "🎉 Setup complete. You may run: fractal pulse"
  set +o allexport
fi

echo "🧬 Cloning from $REPO_URL"

# Brew setup
if ! command -v brew &> /dev/null; then
  echo "🍺 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# if [ -f Brewfile ]; then
#   echo "📦 Installing Brewfile deps..."
#   brew bundle --file=Brewfile
# fi

# Clone/pull repo
if [ -d "$REPO_PATH/.git" ]; then
  echo "📦 Repo exists, pulling latest..."
  cd "$REPO_PATH"
  git pull origin main
else
  echo "📥 Cloning repo... $REPO_URL $REPO_PATH"
  git clone "$REPO_URL" "$REPO_PATH"
  cd "$REPO_PATH"
fi

# Run setup
deno run -A fractal/fractal.ts init
deno run -A fractal/fractal.ts setup

echo "🎉 Setup complete. You may run: fractal pulse"