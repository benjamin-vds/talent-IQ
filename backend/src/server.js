//const express = require("express");
import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";

// better way to import
import { ENV } from "./lib/env.js";

// just importing but best practice is to import in all the files
//import dotenv from "dotenv";
//dotenv.config();

import { connectDB } from "./lib/db.js";

import { inngest, functions } from "./lib/inngest.js";

import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials: true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// loading the clerk authentication
app.use(clerkMiddleware());

// loading inngest hooks 
app.use("/api/inngest", serve({ client: inngest, functions }));

// loading routes for the chats
app.get("/api/chat", chatRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "api is up and running" });
});

app.get("/books", (req, res) => {
  
  res.status(200).json({ message: "api is up and running" });
});



// make our web app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("💥 Error starting the server");
  }
};

startServer();
