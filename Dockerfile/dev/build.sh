#!/usr/bin/env bash

set -e

docker build -t hub.docker.vodjk.com/yst/system-ui:dev .
docker push hub.docker.vodjk.com/yst/system-ui:dev
