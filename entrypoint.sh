#!/bin/sh -l

set -e

git config --global user.name "$INPUT_USER_NAME"
git config --global user.email "$INPUT_USER_EMAIL"

# sh -c "hexo $INPUT_CMD"

echo ::set-output name=notify::$INPUT_CMD