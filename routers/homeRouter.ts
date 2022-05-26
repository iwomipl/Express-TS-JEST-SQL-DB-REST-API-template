import {Router} from "express";
import {User} from "../records/user.record";

export const homeRouter = Router();

homeRouter
    .post('/', async (req, res) => {
        const {email, password, confirmPassword} = req.body;
        if (password === confirmPassword) {
            const newUser = new User({email, password});
            const response = await newUser.insert();

            res.json(response);
        } else {
            res.json({
                "message": "User could not be created",
                "loginStatus": false,
            });
        }
    })
