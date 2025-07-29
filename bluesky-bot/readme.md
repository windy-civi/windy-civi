# Bluesky Bot Spike

## Description

Take the RSS Feed posted for Executive Orders and create a Bluesky post for each new EO in the feed.

## Prerequisite blsky actions

- You must create a profile online at https://bsky.app/
- And you must create an 'App Password' by going to Settings -> Privacy and Security -> App Passwords. This will be used in the .env file later.

## Prerequisite commands for typescript / node setup...

This is what I used, you can use other similar dependencies.
Or see inital instructions here: https://docs.bsky.app/docs/starter-templates/bots

```
nvm install 20
nvm use 20
echo "20" > .nvmrc
npm init -y
npm install @atproto/api dotenv cron
npm i @atproto/api cron dotenv fast-glob
npm install -D typescript tsx @types/node
npx tsc --init
npm install
npm install rss-parser
npm install -D @types/node
```

## Files

- bot.ts - reads the RSS feed and turns each update into a Bluesky post.
- .env - the credentials for your Bluesky account. Paste in your full account name like handle.bsky.social and your App Password created above.
- lastRead.json tracks the last read date of the RSS feed to avoid duplicate posts.

## Run

```
npm run dev
```

For Hoan Huynh billBot.ts:

```
npx ts-node billBot.ts
```
