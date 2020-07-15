FROM node:13-alpine

LABEL version="1.0.0"
LABEL repository="https://github.com/sma11black/hexo-action"
LABEL homepage="https://sma11black.github.io"
LABEL maintainer="sma11black <smallblack@outlook.com>"

COPY entrypoint.sh /entrypoint.sh
COPY sync_deploy_history.js /sync_deploy_history.js

RUN apk add --no-cache git openssh > /dev/null ; \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]