FROM node:13-alpine

LABEL version="1.0.3"
LABEL repository="https://github.com/sma11black/hexo-action"
LABEL homepage="https://sma11black.github.io"
LABEL maintainer="sma11black <smallblack@outlook.com>"

COPY entrypoint.sh sync_deploy_history.js /

RUN apk add --no-cache ca-certificates \
        git \
        openssh-client ; \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
