// fetch_artisan_profiles.js
// Usage: node fetch_artisan_profiles.js

import fs from "fs";
import path from "path";
import csv from "csv-parser";
import OpenAI from "openai";
import "dotenv/config";
import pLimit from "p-limit";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const CSV_PATH = path.join(__dirname, "../data/INDIVIDUAL_PE.csv");
const OUTPUT_PATH = path.join(__dirname, "output.json");

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }
  lock() {
    return new Promise((resolve) => {
      if (this.locked) {
        this.queue.push(resolve);
      } else {
        this.locked = true;
        resolve();
      }
    });
  }
  unlock() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.locked = false;
    }
  }
}

const CONCURRENCY_LIMIT = 5;
const limit = pLimit(CONCURRENCY_LIMIT);
const writeMutex = new Mutex();

async function appendProfileToFile(profile, isFirst) {
  await writeMutex.lock();
  try {
    const jsonStr = JSON.stringify(profile, null, 2);
    if (!isFirst) {
      fs.appendFileSync(OUTPUT_PATH, ",\n");
    }
    fs.appendFileSync(OUTPUT_PATH, jsonStr);
  } finally {
    writeMutex.unlock();
  }
}

async function askOpenAIWithWebSearch(
  name,
  city,
  state,
  email,
  phone1,
  phone2
) {
  const messages = [
    {
      role: "system",
      content: "You are a helpful assistant that answers in valid JSON only.",
    },
    {
      role: "user",
      content: `Respond in English. For the Brazilian artisan \"${name}\", what is their artistic practice and what materials do they use?\n\nHere is additional information from a database: City: ${
        city || ""
      }, State: ${state || ""}, Email: ${email || ""}, Phone 1: ${
        phone1 || ""
      }, Phone 2: ${
        phone2 || ""
      }.\n\nRespond ONLY with a valid JSON object in the following structure. Do not include any explanation, markdown, or text outside the JSON. If any field is missing, leave it null or empty.\n\n{\n  \"artisan_profile\": {\n    \"name\": \"\",\n    \"location\": {\n      \"city\": \"\",\n      \"state\": \"\",\n      \"country\": \"\"\n    },\n    \"contact\": {\n      \"email\": \"\",\n      \"phone\": \"\"\n    }\n  },\n  \"craft_details\": {\n    \"craft_category\": \"\",\n    \"subcategory\": \"\",\n    \"cultural_heritage\": \"\",\n    \"primary_materials\": [],\n    \"techniques_used\": [],\n    \"tools_used\": [],\n    \"product_photos\": []\n  }\n}`,
    },
  ];

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-search-preview",
      web_search_options: {},
      messages,
    });
    let content = completion.choices[0].message.content.trim();
    // Remove code fences if present
    if (content.startsWith("```")) {
      content = content
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse JSON in OpenAI response for", name, e);
    return { name, raw_response: e.message };
  }
}

async function processCSV() {
  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  fs.writeFileSync(OUTPUT_PATH, "[\n");
  let processedCount = 0;
  const total = rows.length;

  await Promise.all(
    rows.map((row, idx) =>
      limit(async () => {
        const name = row["Name"] || row["name"];
        if (!name) return;
        const city = row["City"] || "";
        const state = row["State"] || "";
        const email = row["Email"] || row["email"] || "";
        const phone1 = row["Phone Number 1"] || row["phone_number_1"] || "";
        const phone2 = row["Phone Number 2"] || row["phone_number_2"] || "";
        let phone = phone1;
        if (phone2 && phone1) phone = phone1 + ", " + phone2;
        else if (phone2) phone = phone2;
        console.log(`Processing: ${name}`);
        let profile;
        try {
          profile = await askOpenAIWithWebSearch(
            name,
            city,
            state,
            email,
            phone1,
            phone2
          );
          // Overwrite with CSV data
          if (!profile.artisan_profile) profile.artisan_profile = {};
          if (!profile.artisan_profile.location)
            profile.artisan_profile.location = {};
          if (!profile.artisan_profile.contact)
            profile.artisan_profile.contact = {};
          profile.artisan_profile.name = name;
          profile.artisan_profile.location.city = city;
          profile.artisan_profile.location.state = state;
          profile.artisan_profile.location.country = "Brazil";
          profile.artisan_profile.contact.email = email;
          profile.artisan_profile.contact.phone = phone;
        } catch (err) {
          console.error("Error processing", name, err);
          profile = { name, error: err.message };
        }
        await appendProfileToFile(profile, idx === 0);
        processedCount++;
      })
    )
  );
  fs.appendFileSync(OUTPUT_PATH, "\n]\n");
  console.log("Done! Output written to", OUTPUT_PATH);
}

processCSV();
