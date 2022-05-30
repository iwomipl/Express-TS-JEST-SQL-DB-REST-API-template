import passport from "passport";
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb} from "../utils/password";
import {Application, NextFunction, Request, Response} from "express";
import {ReturnedFromUser, UserEntity} from "../types";
import passportLocal from "passport-local";

interface ReqUser extends Request {
    user?: UserEntity;
}


export function configurePassport(app: Application){

    //serializing and deserializing user
    passport.serializeUser((user: UserEntity, done)=> {
        if (user.password) {
            delete user.password
        }
        done(null, user)
    });
    passport.deserializeUser((user: ReqUser, done)=>done(null, user));

    /*------- SET PASSPORT STRATEGY ----------*/
    passport.use( new passportLocal.Strategy({
        usernameField: 'login',
        passwordField: 'password',
    }, async (login, password, done) => {

        try {
            if (password !== '' && typeof password === 'string' && password.length > 4) {
                const existingUser = await User.getOne(login);
                if (existingUser) {
                    //check if pass
                    await compareHashedPasswordToTheOneFromDb(password, existingUser.password)
                        ? done(null, existingUser)
                        : done(null, false, {
                            "message": `Invalid credentials`,
                            "loginStatus": false,
                        } as ReturnedFromUser);
                } else {
                    done(null, false, {
                        "message": `Such user does not exist`,
                        "loginStatus": false,
                    } as ReturnedFromUser);
                }
            } else {
                done(null, false, {
                    "message": `Something's wrong with your password`,
                    "loginStatus": false,
                } as ReturnedFromUser);
            }
        } catch (err) {
            done(err);
        }
    }));
    app.use(passport.initialize());
}

export const checkAuthentication = async (req: Request, res: Response, next: NextFunction)=>{
    passport.authenticate('local', {session: false}, (err, user, info)=>{
        if (err) {
            return next(err)
        }
        if (info){
            return res.status(401).json({
                message: info.message,
                "loginStatus": false,
            } as ReturnedFromUser);
        }

        if (!user){
            return res.status(401).json({
                message: 'Login again',
                "loginStatus": false,
            } as ReturnedFromUser);
        }
        req.user =  user;
        next();
    })(req, res, next);
}