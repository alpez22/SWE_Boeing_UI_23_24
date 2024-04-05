import cors from "cors";
import express from "express";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

//app.use(express.json());
app.use(cors());


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const LineModel = require('./models/Line'); // Assume you've defined this Mongoose model

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });

// Route to update a LINE
app.post('/update-line', async (req, res) => {
  const { lineNum } = req.body;
  const result = await LineModel.findOneAndUpdate({ lineNum }, { canisterInstallationDate: new Date() }, { new: true });
  if(result) {
    res.json(result);
  } else {
    res.status(404).send('Line not found');
  }
});

const listener = app.listen(40001, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // or "*" for a public API
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
