#!/bin/bash
# Ping IndexNow to notify search engines of updated pages
# Usage: ./ping-indexnow.sh

KEY="21d004a6608b77811b0c8ad48fb92aa6"
HOST="missoula.business"

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"https://${HOST}/${KEY}.txt\",
    \"urlList\": [
      \"https://${HOST}/\",
      \"https://${HOST}/llms.txt\"
    ]
  }"

echo ""
echo "IndexNow ping sent for ${HOST}"
