// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv/config";
import connectDB from "./db/index.js";

// dotenv.config({ path: "./env" });
connectDB();

// Another Good Approch.
/*

import express from "express";

const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("App unable to talk", error);
      throw new Error("App unable to talk to Database");
    });
  } catch (error) {
    console.error("Error", error);
    throw new Error("Database Connection Error");
  }
})();


*/
