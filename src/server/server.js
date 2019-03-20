import express from 'express';
import {sum} from '../shared/sum.js';

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5656;

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

app.get('/sum', (req, res) => {
    // console.log(req.query);
    let { a, b } = req.query;
    console.log(a, b);
    res.status(200)
        .send(sum(a, b))
        .end();
});