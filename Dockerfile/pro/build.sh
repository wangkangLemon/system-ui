#!/usr/bin/env bash

set -e

docker build -t hub.docker.vodjk.com/yst/system-ui:probase ./base/
docker create --name yst-system-ui-probase hub.docker.vodjk.com/yst/system-ui:probase
docker cp yst-system-ui-probase:/go/src/git.vodjk.com/yst/system-ui .

tag=`git rev-parse --short=12 HEAD`

docker build -t hub.docker.vodjk.com/yst/system-ui:pro_${tag} .
docker tag hub.docker.vodjk.com/yst/system-ui:pro_${tag} hub.docker.vodjk.com/yst/system-ui:pro
docker push hub.docker.vodjk.com/yst/system-ui:pro_${tag}
docker push hub.docker.vodjk.com/yst/system-ui:pro

rm -fR system-ui
docker rm yst-system-ui-probase
docker rmi hub.docker.vodjk.com/yst/system-ui:pro
docker rmi hub.docker.vodjk.com/yst/system-ui:pro_${tag}
