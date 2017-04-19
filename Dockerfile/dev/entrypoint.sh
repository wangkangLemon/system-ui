#!/usr/bin/env bash

export BRANCH=$1
if [[ $BRANCH == "" ]]; then export BRANCH=develop; fi

cd $GOPATH/src/git.vodjk.com/yst/system-ui
git pull origin $BRANCH
cd $GOPATH/src/git.vodjk.com/yst/system-ui/assets
yarn install
yarn run build
cd $GOPATH/src/git.vodjk.com/yst/system-ui
go build
./system-ui