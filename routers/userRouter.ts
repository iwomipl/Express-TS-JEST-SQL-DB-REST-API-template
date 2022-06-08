import {Router} from 'express';
import {User} from '../records/user.record';
import {compareHashedPasswordToTheOneFromDb, hashThePass} from '../utils/password';
import {UserEntity} from "../types";
import {checkIfAuthenticated, checkIfLogin} from "../middlewares/passport-strategies.mw";

export const userRouter = Router();

userRouter
    .post('/register', async (req, res) => {
        const {
            login,
            confirmPassword,
            passFromFront = req.body.password
        }: { login: string, passFromFront: string, confirmPassword: string } = req.body;
        if (passFromFront !== confirmPassword) {
            return res.status(400).json({
                "message": "User could not be created, Password input value  does NOT match the Confirm Password input value ",
                "loginStatus": false,
            });
        } else if (!login.match(/^[\w-_.@]{5,25}$/i)) {
            return res.status(400).json({
                "message": "User could not be created, Your Login should be only letters '-', '_' , '.', and '@' ",
                "loginStatus": false,
            });
        } else if (typeof passFromFront === 'string' && passFromFront.length > 4 && passFromFront.length < 25) {
            const password = await hashThePass(passFromFront);
            const newUser = new User({login, password});
            const response = await newUser.insert();

            return res.json(response);
        } else {
            res.status(401).json({
                "message": "User could not be created, try again later or use different credentials",
                "loginStatus": false,
            });
        }
    })
    .post('/login', checkIfLogin, async (req, res) => {
        if (req.user) {
            return res.json(await User.login((req.user as UserEntity).login));
        } else {
            res.status(401).json({
                "message": `Invalid credentials`,
                "loginStatus": false,
            })
        }
    })
    .get('/', checkIfAuthenticated, async (req, res) => {
        if (req.user) {
            res.json({
                "message": `We're cool`,
                "loginStatus": true,
            });
        } else {
            res.status(401).json({
                "message": `Invalid credentials`,
                "loginStatus": false,
            })
        }
    })
    .delete('/', checkIfAuthenticated, async (req, res) => {
        const {password} = req.body;
        const user: any = req.user;
        const userToDelete = await User.getOne(user.login);
        if (userToDelete) {
            if (await compareHashedPasswordToTheOneFromDb(password, userToDelete.password)) {
                const response = await User.deleteUser(userToDelete.login) ?
                    {
                        "message": `User NOT Deleted`,
                        "loginStatus": true,
                    } :
                    {
                        "message": `User Deleted`,
                        "loginStatus": false,
                    }
                return res.json(response);
            }
            return res.json({
                "message": `User NOT Deleted: wrong password`,
                "loginStatus": false,
            });
        }
        return res.json({
            "message": `User NOT Deleted: User doesn't exist`,
            "loginStatus": false,
        });

    })

