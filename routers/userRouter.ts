import {Router} from "express";
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb, hashThePass} from "../utils/password";

export const userRouter = Router();

userRouter
    .post('/register', async (req, res) => {
        const {email, confirmPassword} = req.body;
        if (req.body.password !== confirmPassword){
            return res.status(400).json({
                "message": "Input value Password does NOT match the Confirm Password Input value ",
                "loginStatus": false,
            });
        } else if (req.body.password !== '' && req.body.password >4 && req.body.password <25) {
            const password = await hashThePass(req.body.password);
            const newUser = new User({email, password});
            const response = await newUser.insert();
            console.log(response)
            res.json(response);
        } else {
            res.status(401).json({
                "message": "User could not be created, try again later or use different credentials",
                "loginStatus": false,
            });
        }
    })
    .post('/login', async (req, res) => {
            const {email} = req.body;
            if (req.body.password !== '' && typeof req.body.password === 'string' && req.body.password >4) {
                const existingUser = await User.getOne(email);
                if (existingUser) {
                    const result = await compareHashedPasswordToTheOneFromDb(req.body.password, existingUser.password);

                    if (result) {
                        // await User.login(email, password);
                        return res.json({
                            "message": `User ${email} logged in.`,
                            "loginStatus": true,
                        });
                    }
                }
            }
        res.status(401).json({
            "message": `Invalid credentials`,
            "loginStatus": false,
        });
        }
    )
