#!/usr/bin/env bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# Setting up .env file
sh $SCRIPTPATH/.env-setup.sh

# Installing Fly Deployment Stuff
sh $SCRIPTPATH/fly-install.sh

# Prepare
npm i
npm run docker
npm run setup
npm run build
