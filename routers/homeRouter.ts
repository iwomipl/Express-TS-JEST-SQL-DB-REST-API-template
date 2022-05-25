import {Router} from "express";

export const homeRouter = Router();

homeRouter
    .post('/', (req, res)=>{
        const {body} = req;
        console.log(body);
        res.json({"message": "i'm Working with json"});
    })
