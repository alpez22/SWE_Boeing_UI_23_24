import cors from "cors";
import express from "express";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const listener = app.listen(40001, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // or "*" for a public API
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});