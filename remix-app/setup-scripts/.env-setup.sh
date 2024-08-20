#!/bin/sh

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# Set .env file values from environment (aka env | grep ...)
# usage:
# setenv -env GOOGLE_API_KEY .env // for getting from environment
# setenv TEST value .env.local
setenv(){
    # key=""
    # value=""
    
    if [ $1 = "-env" ]; then
        key=$2
        # get from environment var
        envKV=$(env | grep $key)
        # extract just value from env grep
        value=$(echo "$envKV" | sed "s/$key=//")
        file=$3
    else
        key=$1
        value=$2
        file=$3
    fi
    sed  -i  "/$key/c\\$key=\"$value\"" $file
}

# set env files
cp $SCRIPTPATH/.env.example $SCRIPTPATH/../.env
setenv -env GOOGLE_API_KEY $SCRIPTPATH/../.env
setenv -env LEGISCAN_API_KEY $SCRIPTPATH/../.env
setenv SESSION_SECRET $(openssl rand -hex 32) $SCRIPTPATH/../.env

echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲 .env file has been configured 🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
echo "    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲"
