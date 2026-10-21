#!/usr/bin/env bash
# Publica dist/ en la rama gh-pages del remoto "origin" (GitHub Pages).
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL="$(git remote get-url origin)"
npm run build
cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -qf "$REMOTE_URL" gh-pages
rm -rf .git
echo "Publicado en gh-pages"
