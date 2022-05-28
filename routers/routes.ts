import {Router} from 'express';
import {userRouter} from "./userRouter";

export const routes = Router();

routes.use('/user', userRouter);