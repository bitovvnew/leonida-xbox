#!/usr/bin/env bash
# verify a pulled build against SHA256SUMS before first launch
set -euo pipefail

dir="${1:-.}"
cd "$dir"

if [[ ! -f SHA256SUMS ]]; then
  echo "SHA256SUMS not found in $dir" >&2
  exit 1
fi

echo "verifying $(wc -l < SHA256SUMS) files..."
if sha256sum --quiet -c SHA256SUMS; then
  echo "ok: build matches the signed manifest"
else
  echo "mismatch: re-pull the files listed above" >&2
  exit 2
fi
