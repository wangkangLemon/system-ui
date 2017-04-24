#!/usr/bin/env bash

set -e

export BRANCH=$1
if [[ $BRANCH == "" ]]; then export BRANCH=develop; fi

cd $GOPATH/src/git.vodjk.com/yst/system-ui
git pull origin $BRANCH
cd $GOPATH/src/git.vodjk.com/yst/system-ui/assets
yarn run build -- -h http://10.1.2.140
cd $GOPATH/src/git.vodjk.com/yst/system-ui
go build
./system-ui