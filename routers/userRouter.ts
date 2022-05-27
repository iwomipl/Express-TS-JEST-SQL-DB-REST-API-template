import {Router} from "express";
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb, hashThePass} from "../utils/password";

export const userRouter = Router();

userRouter
    .post('/register', async (req, res) => {
        const {email, confirmPassword, passFromFront = req.body.password}: {email: string, passFromFront: string, confirmPassword: string} = req.body;
        if (passFromFront !== confirmPassword){
            return res.status(400).json({
                "message": "Password input value  does NOT match the Confirm Password input value ",
                "loginStatus": false,
            });
        } else if(!email.match(/^[\w-_.@]{5,25}$/i)){
            return res.status(400).json({
                "message": "Your Login or email should be only letters '-', '_' , '.', and '@' ",
                "loginStatus": false,
            });
        } else if (passFromFront !== '' && passFromFront.length >4 && passFromFront.length <25) {
            const password = await hashThePass(passFromFront);
            const newUser = new User({email, password});
            const response = await newUser.insert();

            res.json(response);
        } else {
            res.status(401).json({
                "message": "User could not be created, try again later or use different credentials",
                "loginStatus": false,
            });
        }
    })
    .post('/login', async (req, res) => {
            const {email, password}: {email:string, password: string} = req.body;
            if (password !== '' && typeof password === 'string' && password.length >4) {
                const existingUser = await User.getOne(email);
                if (existingUser) {
                    const result = await compareHashedPasswordToTheOneFromDb(password, existingUser.password);

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
