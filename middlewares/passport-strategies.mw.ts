import passport from "passport";
import * as passportJWT from 'passport-jwt';
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb} from "../utils/password";
import {Application, NextFunction, Request, Response} from "express";
import {ReturnedFromUser, UserEntity} from "../types";
import passportLocal from "passport-local";
import {config} from "../config/config";

interface ReqUser extends Request {
    user?: UserEntity;
}

interface Payload {
    login: string;
    lastLoggedIn: Date;
}

export function configurePassport(app: Application) {

    //serializing and deserializing user
    passport.serializeUser((user: (ReqUser | Payload), done) => done(null, user));
    passport.deserializeUser((user: ReqUser, done) => done(null, user));

    /*------- SET PASSPORT STRATEGY ----------*/
    passport.use(new passportLocal.Strategy({
        usernameField: 'login',
        passwordField: 'password',
    }, async (login, password, done) => {

        try {
            if (password !== '' && typeof password === 'string' && password.length > 4) {
                const existingUser = await User.getOne(login);
                if (existingUser) {
                    //check if pass
                    const comparedToBoolean = await compareHashedPasswordToTheOneFromDb(password, existingUser.password)
                    delete existingUser.password;
                    comparedToBoolean
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

    passport.use(new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret,
    }, (payload: Payload, done) => {
        try{
            done(null, payload);
        } catch (err){
            done(err);
        }
    }));
    app.use(passport.initialize());
}

export const checkIfLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (info) {
            return res.status(401).json({
                message: info.message,
                "loginStatus": false,
            } as ReturnedFromUser);
        }

        if (!user) {
            return res.status(401).json({
                message: 'Login again',
                "loginStatus": false,
            } as ReturnedFromUser);
        }
        req.user = user;
        next();
    })(req, res, next);
}

export const checkIfAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (info) {
            return res.status(401).json({
                message: info.message,
                "loginStatus": false,
            } as ReturnedFromUser);
        }

        if (!user) {
            return res.status(401).json({
                message: 'Login again',
                "loginStatus": false,
            } as ReturnedFromUser);
        }
        req.user = user;
        next();
    })(req, res, next);
}