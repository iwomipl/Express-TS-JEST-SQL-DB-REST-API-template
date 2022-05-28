import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import {configurePassport} from "./middlewares/passport-strategies.mw";
import {handleError} from './utils/errors';
import {config} from './config/config';
import {routes} from "./routers/routes";
import './utils/db';




const local = `Listening on http://${config.serverHost}:${config.serverPort}`;

const app = express();


/*------- MIDDLEWARE ----------*/
app.use(cors({
    origin: config.corsOrigin,
}));
configurePassport(app);
// app.use(passport.initialize());
app.use(express.json());

/*------- ROUTERS ----------*/
app.use(routes);

/*------- ERROR HANDLER ----------*/
app.use(handleError);

app.listen(3001, config.serverHost, () => {
    console.log(local);
});

