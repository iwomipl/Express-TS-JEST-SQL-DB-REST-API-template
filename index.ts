import express from 'express';
import 'express-async-errors';
import './utils/db';
import {homeRouter} from "./routers/homeRouter";
import {handleError} from "./utils/errors";

const port ='3001';
const host = 'localhost';
const local = `Listening on http://${host}:${port}`;

const app = express();

app.use('/', homeRouter);

app.use(handleError)

app.listen(3001, host, () => {
    console.log(local);
});
