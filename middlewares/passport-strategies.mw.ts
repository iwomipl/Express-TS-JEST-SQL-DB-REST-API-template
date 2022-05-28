import passport from "passport";
import {User} from "../records/user.record";
import {compareHashedPasswordToTheOneFromDb} from "../utils/password";
import {Application, Request} from "express";
import {UserEntity} from "../types";
import passportLocal from "passport-local";

interface ReqUser extends Request {
    user?: UserEntity;
}

/*------- SET PASSPORT STRATEGY ----------*/
export function configurePassport(app: Application){

    //serializing and deserializing user
    passport.serializeUser((user: ReqUser, done)=>done(null, user));
    passport.deserializeUser((user: ReqUser, done)=>done(null, user));

    passport.use( new passportLocal.Strategy({
        usernameField: 'login',
        passwordField: 'password',
    }, async (login, password, done) => {

        try {
            if (password !== '' && typeof password === 'string' && password.length > 4) {
                const existingUser = await User.getOne(login);
                if (existingUser) {
                    await compareHashedPasswordToTheOneFromDb(password, existingUser.password)
                        ? done(null, {...existingUser, password: '',} as UserEntity)
                        : done(null, false);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    }));
    app.use(passport.initialize());
}
