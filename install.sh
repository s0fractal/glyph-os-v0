#!/bin/bash
set -e

echo "🌱 Fractal Bootstrap Started"

# Load env if present
if [ -f .fractal.env ]; then
  source .fractal.env
fi
REPO_USER="${🧑‍🔬:-s0fractal}"
REPO_NAME="${📦:-glyph-os-v0}"
REPO_ORIGIN="${🧬:-$REPO_USER/$REPO_NAME}"
REPO_PATH="${🌱:-$HOME/.s0fractal}"
REPO_URL="${🌐:-https://github.com/${REPO_ORIGIN}.git}"

echo "🧬 Cloning from $REPO_URL"

# Brew setup
if ! command -v brew &> /dev/null; then
  echo "🍺 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

if [ -f Brewfile ]; then
  echo "📦 Installing Brewfile deps..."
  brew bundle --file=Brewfile
fi

# Clone/pull repo
if [ -d "$REPO_PATH/.git" ]; then
  echo "📦 Repo exists, pulling latest..."
  cd "$REPO_PATH"
  git pull origin main
else
  echo "📥 Cloning repo..."
  git clone "$REPO_URL" "$REPO_PATH"
  cd "$REPO_PATH"
fi

# Run setup
deno run -A fractal/fractal.ts init
deno run -A fractal/fractal.ts setup

echo "🎉 Setup complete. You may run: fractal pulse"