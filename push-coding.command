#!/bin/zsh
cd "$(dirname "$0")"
git add .
git commit -m "Quick sync"
git push origin main