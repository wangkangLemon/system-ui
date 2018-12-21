FROM hub.docker.vodjk.com:5000/node:6.10-alpine
MAINTAINER coldstar yanghf@vodjk.com

ENV NODE_ENV production
ENV PORT 80

RUN mkdir -p /usr/local/server/yst/system-ui

WORKDIR /usr/local/server/yst/system-ui

ADD system-ui/bin ./bin/
ADD system-ui/node_modules ./node_modules/
ADD system-ui/public ./public/
ADD system-ui/routes ./routes/
ADD system-ui/views ./views/
ADD system-ui/app.js .
ADD system-ui/package.json .

ADD entrypoint.sh /

EXPOSE 80

CMD ["/entrypoint.sh"]