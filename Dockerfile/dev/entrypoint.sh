#!/usr/bin/env bash

set -e

export BRANCH=$1
if [[ $BRANCH == "" ]]; then export BRANCH=develop; fi

cd /node/src/git.vodjk.com/yst/system-ui
git pull origin $BRANCH
cd /node/src/git.vodjk.com/yst/system-ui/assets
yarn run build
cd /node/src/git.vodjk.com/yst/system-ui
npm run start