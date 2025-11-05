//const express = require("express");
import express from "express";
import path from "path";

// better way to import
import {ENV} from "./lib/env.js"; 

// just importing but best practice is to import in all the files
//import dotenv from "dotenv";
//dotenv.config();

const app = express();

const __dirname = path.resolve();
console.log(__dirname);
app.get("/health", (req,res) => {
    res.status(200).json({msg: "api is up and running"});
})

app.get("/books", (req,res) => {
    res.status(200).json({msg: "api is up and running"});
})

// make our web app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`))