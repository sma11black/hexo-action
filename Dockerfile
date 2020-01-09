FROM node:10

LABEL version="1.0.0"
LABEL repository="https://github.com/sma11black/hexo-action"
LABEL homepage="https://sma11black.github.io"
LABEL maintainer="smallblack <smallblack@outlook.com>"

RUN apt-get update && \
    apt-get install -y git-core

RUN npm install -g hexo hexo-deployer-git

RUN npm install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["help"]