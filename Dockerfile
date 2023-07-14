FROM node:20-buster-slim

LABEL version="1.0.7"
LABEL repository="https://github.com/marsen/hexo-action"
LABEL homepage="https://blog.marsen.me"
LABEL maintainer="marsen.lin <admin@marsen.me>"

COPY entrypoint.sh /entrypoint.sh
COPY sync_deploy_history.js /sync_deploy_history.js

RUN apt-get update > /dev/null && \
    apt-get install -y git openssh-client > /dev/null ; \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]