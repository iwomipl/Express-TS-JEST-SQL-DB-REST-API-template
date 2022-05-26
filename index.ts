import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import './utils/db';
import {userRouter} from "./routers/userRouter";
import {handleError} from "./utils/errors";
import {config} from "./config/config";


const local = `Listening on http://${config.serverHost}:${config.serverPort}`;

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));
app.use(express.json());

app.use('/user', userRouter);

app.use(handleError);

app.listen(3001, config.serverHost, () => {
    console.log(local);
});

