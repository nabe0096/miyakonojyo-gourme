#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push
echo "✅ デプロイ完了！反映まで1〜2分お待ちください。"
echo "🌐 https://nabe0096.github.io/miyakonojyo-gourme/"
