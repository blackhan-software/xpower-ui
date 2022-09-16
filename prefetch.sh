#!/usr/bin/env bash
CONTENT_PATH="./public/content"
mkdir -p "$CONTENT_PATH" ; ## ensure path
ABOUT_PATH="$CONTENT_PATH/about.md"
touch "$ABOUT_PATH" ; ## empty fallback

if [[ "$IPFS_GATEWAY" && "$MD_ABOUT_URL" ]] ; then
    wget "$IPFS_GATEWAY/$MD_ABOUT_URL" -O "$ABOUT_PATH" -q ;
fi
