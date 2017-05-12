#!/usr/bin/env bash

set -e

docker build -t hub.docker.vodjk.com/yst/system-ui:demo .
docker push hub.docker.vodjk.com/yst/system-ui:demo
