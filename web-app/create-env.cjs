/* eslint-disable @typescript-eslint/no-var-requires */

// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const path = require("path");

// eslint-disable-next-line no-undef
const env = path.join(__dirname, ".env");

// eslint-disable-next-line no-undef
let apiKey = process.env.GOOGLE_API_KEY;

// eslint-disable-next-line no-undef
if (!apiKey) {
  console.warn(
    "⚠️ WARNING: GOOGLE_API_KEY is missing from the environment. Using default placeholder value 'abcd'.",
  );
  apiKey = "abcd";
}

// eslint-disable-next-line no-undef
fs.writeFileSync(env, `VITE_GOOGLE_API_KEY='${apiKey}'\n`);

console.log("web-app: Environment variables created successfully.");
