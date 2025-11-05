//const express = require("express");
import express from "express";

// better way to import
import {ENV} from "./lib/env.js"; 

// just importing but best practice is to import in all the files
//import dotenv from "dotenv";
//dotenv.config();

const app = express();

app.get("/", (req,res) => {
    res.status(200).json({msg: "success from backend 123456"});
})

app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`))