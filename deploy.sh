#!/bin/bash
set -e
cd "$(dirname "$0")"
python3 scripts/optimize_images.py
git add -A -- . ':!.DS_Store' ':!**/.DS_Store'
if git diff --cached --quiet; then
  echo "公開する変更はありません。"
  exit 0
fi
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push
echo "✅ デプロイ完了！反映まで1〜2分お待ちください。"
echo "🌐 https://nabe0096.github.io/miyakonojyo-gourme/"
