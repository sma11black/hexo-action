#!/bin/sh

set -e

# setup ssh-private-key
mkdir -p /root/.ssh/
echo "$INPUT_DEPLOY_KEY" > /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa
ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts

# setup deploy git account
git config --global user.name "$INPUT_USER_NAME"
git config --global user.email "$INPUT_USER_EMAIL"

# install hexo env
npm install hexo-cli -g
npm install hexo-deployer-git --save

git clone https://github.com/$GITHUB_ACTOR/$GITHUB_ACTOR.github.io.git .deploy_git

# deployment
hexo g -d -m "$GITHUB_EVENT_HEAD_COMMIT_MESSAGE"

echo ::set-output name=notify::"Deploy complate."