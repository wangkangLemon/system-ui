FROM hub.docker.vodjk.com/node/common

MAINTAINER $GOPATH/src/

RUN mkdir -p $GOPATH/src/git.vodjk.com/yst \
    && cd git.vodjk.com/yst/ \
    && git clone ssh://git@git.vodjk.com:10022/yst/system-ui.git

ADD "http://192.168.40.231/yst/system-ui.atom?private_token=7XxYJqdG_LGy7poftisV" git.vodjk.com/yst/

RUN cd git.vodjk.com/yst/system-ui/ \
    && git checkout master \
    && git pull origin master

RUN cd git.vodjk.com/yst/system-ui/assets \
    && cp config/config.js.default config/config.js \
    && yarn install \
    && yarn run build
