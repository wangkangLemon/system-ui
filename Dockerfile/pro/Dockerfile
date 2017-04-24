FROM hub.docker.vodjk.com/alpine:xinma
MAINTAINER coldstar yanghf@vodjk.com

RUN mkdir -p /usr/local/server/yst/system-ui

WORKDIR /usr/local/server/yst/system-ui

ADD system-ui/conf ./conf/
ADD system-ui/public ./public/
ADD system-ui/system-ui .
ADD entrypoint.sh /

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
