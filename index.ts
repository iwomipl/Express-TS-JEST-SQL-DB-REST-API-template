import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import './utils/db';
import {homeRouter} from "./routers/homeRouter";
import {handleError} from "./utils/errors";
import {config} from "./config/config";


const local = `Listening on http://${config.serverHost}:${config.serverPort}`;

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(express.json());

app.use('/', homeRouter);

app.use(handleError);

app.listen(3001, config.serverHost, () => {
    console.log(local);
});

