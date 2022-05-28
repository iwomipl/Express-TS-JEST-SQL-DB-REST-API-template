import {Router} from "express";
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb, hashThePass} from "../utils/password";

export const userRouter = Router();

userRouter
    .post('/register', async (req, res) => {
        const {login, confirmPassword, passFromFront = req.body.password}: {login: string, passFromFront: string, confirmPassword: string} = req.body;
        if (passFromFront !== confirmPassword){
            return res.status(400).json({
                "message": "Password input value  does NOT match the Confirm Password input value ",
                "loginStatus": false,
            });
        } else if(!login.match(/^[\w-_.@]{5,25}$/i)){
            return res.status(400).json({
                "message": "Your Login should be only letters '-', '_' , '.', and '@' ",
                "loginStatus": false,
            });
        } else if (passFromFront !== '' && passFromFront.length >4 && passFromFront.length <25) {
            const password = await hashThePass(passFromFront);
            const newUser = new User({login, password});
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
            const {login, password}: {login:string, password: string} = req.body;
            if (password !== '' && typeof password === 'string' && password.length >4) {
                const existingUser = await User.getOne(login);
                if (existingUser) {
                    const result = await compareHashedPasswordToTheOneFromDb(password, existingUser.password);

                    if (result) {
                        return res.json(await User.login(login));
                    }
                }
            }
        res.status(401).json({
            "message": `Invalid credentials`,
            "loginStatus": false,
        });
        }
    )
