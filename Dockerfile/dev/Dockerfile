FROM hub.docker.vodjk.com/node/common
MAINTAINER jingziming fenghk@vodjk.com

WORKDIR /node/src/

# 指定dev编译环境，调用dev接口域名
ENV RUN_ENV dev

RUN mkdir -p /node/src/git.vodjk.com/yst \
    && cd git.vodjk.com/yst/ \
    && git clone ssh://git@git.vodjk.com:10022/yst/system-ui.git

ADD "http://192.168.40.231/yst/system-ui.atom?private_token=7XxYJqdG_LGy7poftisV" git.vodjk.com/yst/

RUN cd /node/src/git.vodjk.com/yst/system-ui \
    && git checkout develop \
    && git pull origin develop 

RUN cd /node/src/git.vodjk.com/yst/system-ui/assets \
    && cp config/config.js.default config/config.js \
    && yarn install

ADD entrypoint.sh /

EXPOSE 80

CMD ["/entrypoint.sh"]