import cors from "cors";
import express from "express";
// Load environment variables
import "./loadEnvironment.js";
import db from "./db/conn.js";
import { z } from "zod";
import parseSchema from "./utils/parseSchema.js";
import addLineSchema from "./schemas/addLineSchema.js";
import updateLineSchema from "./schemas/updateLineSchema.js";


const app = express();

app.use(express.json());
app.use(cors());

app.get("/lines", async (req, res) => {
    let linesCollection = await db.collection("lines");
    let results = await linesCollection.find({})
        .toArray();
    res.send(results).status(200);
})

app.get("/lines/:id/trash-empties", async (req, res) => {
    const id = req.params.id;
    const { page } = req.query

    if (!page) {
        return res.sendStatus(400);
    }
    
    let linesCollection = await db.collection("lines");

    let line = await linesCollection.findOne({
        lineId: id
    }, {
        _id: 1
    })

    if (!line) {
        return res.sendStatus(404);
    }

    let trashEmptiesCollection = await db.collection("trashempties");
    const trashEmpties = await trashEmptiesCollection.find({
        lineId: id
    }, {
        projection: {
            weight: 1,
            date: 1
        }
    }).sort({ date: -1 }).skip(page * 10).limit(10).toArray();

    const totalTrashEmpties = await trashEmptiesCollection.countDocuments({
        lineId: id
    })

    res.send({
        trashEmpties: trashEmpties,
        total: totalTrashEmpties
    }).status(200);
})

app.get("/lines/:id/canister-changes", async (req, res) => {
    const id = req.params.id;
    const { page } = req.query

    if (!page) {
        return res.sendStatus(400);
    }
    
    let linesCollection = await db.collection("lines");

    let line = await linesCollection.findOne({
        lineId: id
    }, {
        _id: 1
    })

    if (!line) {
        return res.sendStatus(404);
    }

    let canisterChangesCollection = await db.collection("canisterchanges");
    const canisterChanges = await canisterChangesCollection.find({
        lineId: id
    }, {
        projection: {
            date: 1
        }
    }).sort({ date: -1 }).skip(page * 10).limit(10).toArray();

    const totalCanisterChanges = await canisterChangesCollection.countDocuments({
        lineId: id
    })

    res.send({
        canisterChanges: canisterChanges,
        total: totalCanisterChanges
    }).status(200);
})

app.post("/lines", async (req, res) => {
    const body = parseSchema(addLineSchema, req.body);
    if (body) {
        let linesCollection = await db.collection("lines");
        let result = await linesCollection.insertOne(body);
        
        if (result.acknowledged) {
            return res.send(200);
        }
        else {
            return res.send(500);
        }
    } else {
        res.send(400);
    }

})

/* ARDUINO ENDPOINTS */
app.post("/lines/:id/canister-changes", async (req, res) => { //button for canister being replaced
    const id = req.params.id
    let linesCollection = await db.collection("lines")
    let lineUpdateResult = await linesCollection.updateOne({
        lineId: id
    }, {
        $set: {
            installationDate: Date.now()
        }
    })

    if (lineUpdateResult.matchedCount == 0) {
        return res.sendStatus(404);
    }

    let canisterChangesCollection = await db.collection("canisterchanges")
    let result = await canisterChangesCollection.insertOne({
        lineId: id,
        date: Date.now()
    })

    res.sendStatus(200);
})

app.put("/lines/:id", async (req, res) => { //send weight and waste rate to this api, which will be compared to those constants in frontend && if weight goes below, record on historical
    const id = req.params.id;
    const body = parseSchema(updateLineSchema, req.body);

    if (!body) {
        res.sendStatus(400);
    }
    let linesCollection = await db.collection("lines");
    let oldLine = await linesCollection.findOneAndUpdate({
        lineId: id
    }, {
        $set: {
            weight: body.weight,
            wasteRate: body.wasteRate
        }
    }, {
        returnDocument: "before",
        projection: {
            weight: 1
        }
    })

    if (!oldLine) {
        return res.sendStatus(404);
    }

    if (oldLine.weight - body.weight > 200) {
        // Trashcan is emptied
        let trashEmptiesCollection = await db.collection("trashempties")
        let result = await trashEmptiesCollection.insertOne({
            lineId: id,
            weight: oldLine.weight,
            date: Date.now()
        })
    }

    res.sendStatus(200);
})

/* --------------------- */

const listener = app.listen(3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // or "*" for a public API
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});