import {Router} from "express";
import {User} from "../records/user.record";

export const userRouter = Router();

userRouter
    .post('/register', async (req, res) => {
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
    .post('/login', async (req, res) => {
        const {email, password} = req.body;
            res.json({
                "message": `User ${email} logged in with password ${password}`,
                "loginStatus": false,
            });

    })
