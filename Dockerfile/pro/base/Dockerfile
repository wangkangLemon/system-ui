FROM hub.docker.vodjk.com/node/golang

MAINTAINER $GOPATH/src/

RUN mkdir -p $GOPATH/src/git.vodjk.com/yst \
    && cd git.vodjk.com/yst/ \
    && git clone ssh://git@git.vodjk.com:10022/yst/system-ui.git

RUN cd git.vodjk.com/yst/system-ui/ \
    && git checkout master \
    && git pull origin master \
    && CGO_ENABLED=0 go build -a

RUN cd git.vodjk.com/yst/system-ui/assets \
    && yarn install \
    && yarn run build