/* eslint-disable @typescript-eslint/no-var-requires */

// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const path = require("path");

// eslint-disable-next-line no-undef
const env = path.join(__dirname, ".env");

// eslint-disable-next-line no-undef
fs.writeFileSync(env, `VITE_GOOGLE_API_KEY='${process.env.GOOGLE_API_KEY}'\n`);

console.log("Environment variables created successfully.");

fs.readFileSync(env, "utf-8")
  .split("\n")
  .forEach((line) => {
    console.log(line);
  });
