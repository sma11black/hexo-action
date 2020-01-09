#!/bin/sh -l

set -e

git config --global user.name "$INPUT_USER_NAME"
git config --global user.email "$INPUT_USER_EMAIL"

# sh -c "hexo $cmd"

echo ::set-output name=notify::$cmd