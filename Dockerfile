FROM node:13-alpine

LABEL version="1.0.0"
LABEL repository="https://github.com/sma11black/hexo-action"
LABEL homepage="https://sma11black.github.io"
LABEL maintainer="sma11black <smallblack@outlook.com>"

RUN apk add --no-cache git
RUN apk add --no-cache openssh

# Install Hexo Env
RUN npm install hexo-cli -g
RUN npm install hexo-deployer-git --save

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]