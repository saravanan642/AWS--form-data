require("dotenv").config({ quiet: true });
const express = require("express");
const cors =require("cors")
const listen = require("./config/listen");
const Database = require("./config/database");
const mongoose = require("mongoose");

const IndexRouter = require("./Router/indexrouter");

const app = express();

app.use(express.json());
app.use(cors)

Database(mongoose);

app.use(IndexRouter);

listen(app);    