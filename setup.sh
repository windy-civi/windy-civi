#!/bin/bash

# Function to output banner-style logs
log() {
    local message="$1"
    local padding=4 # Spaces around the message inside the box
    local border_char="*"
    local inner_width=$(( ${#message} + (padding * 2) ))

    # Create the border
    local border=$(printf "%${inner_width}s" | tr " " "$border_char")

    echo
    echo "$border"
    printf "${padding}s$message%${padding}s"
    echo "$border"
    echo
}

# Commands To Install

log "🏗️ Installing Domain"
cd ./domain

log "🏗️ Installing windy-civi-storage Storage CLI"
cd ../storage
npm i

log "🏗️ Installing Scraper"
cd ../scraper
npm i

log "🏗️ Installing Web App"
cd ../web-app
npm i

log "🏗️ Installing Expo React Native \n 🏗️ Warning: For Codespaces, The App Will Only Work With Expo"
cd ../native-app
npm i




