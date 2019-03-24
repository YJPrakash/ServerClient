import express from 'express';
import fs from 'fs';

// import {
//     sum
// } from '../shared/sum.js';

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5656;

const DATA_FILE_PATH = "/mnt/e/Workspace/Node/ServerClient/src/server/data/";
const DATA_FILE_EXTN = ".json";
// routes go here
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.listen(port, () => {
    console.log(`http://${host}:${port}`);
});

app.use(express.static(__dirname + "/"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/");
});

// app.get('/sum', (req, res) => {
//     // console.log(req.query);
//     let {
//         a,
//         b
//     } = req.query;
//     console.log(a, b);
//     res.status(200)
//         .send(sum(a, b))
//         .end();
// });

app.get("/read", (req, res) => {
    let {
        file_name
    } = req.query;
    // res.setHeader("content-type", "application/json");
    res.setHeader("content-type", "text/plain");
    res.sendFile(DATA_FILE_PATH + file_name + DATA_FILE_EXTN);
});

app.get("/update", (req, res) => {
    let db = [],
        emp = req.query;
    let {
        file_name
    } = emp;
    // console.log(req.query);
    // console.log(file_name);
    res.setHeader("content-type", "text/html");
    res.status(200);
    fs.readFile(DATA_FILE_PATH + file_name + DATA_FILE_EXTN, (err, result) => {
        if (err) res.send("{status: error}");
        if (result != "") {
            db = JSON.parse(result);
        }
        delete emp.file_name;
        db.push(emp);
        fs.writeFile(DATA_FILE_PATH + file_name + DATA_FILE_EXTN, JSON.stringify(db), ()=>{
            // console.log(db);
            res.send("{status: success}");
        });
    });
});