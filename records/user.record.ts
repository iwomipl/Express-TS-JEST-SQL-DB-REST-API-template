import { ReturnedFromUser, ReturnedFromValidation, UserEntity} from "../types";
import {v4 as uuid} from 'uuid';
import { pool } from "../utils/db";
import {FieldPacket} from "mysql2";
import { ValidationError } from "../utils/errors";

export type UserRecordResults = [UserEntity[], FieldPacket[]]

export class User implements UserEntity{
    public id?: string;
    public login: string;
    public createdAt?: Date;
    public lastLoggedIn?: Date;
    public password: string;

    constructor(obj: UserEntity){
        if (!obj.login || obj.login.length < 4 || obj.login.length > 25 ) {
            throw new ValidationError('You must give a proper login address.');
        }
     this.id = obj.id;
     this.login = obj.login;
     this.createdAt = obj.createdAt || null;
     this.lastLoggedIn = obj.lastLoggedIn || null;
     this.password = obj.password;
    }
    async _validateBeforeInserting(): Promise<ReturnedFromValidation>{
        if (this.id){
            return {
                "message": "Cannot insert something that is already inserted!",
                "validationStatus": false,
            };
        }
        if (await User.getOne(this.login.toLowerCase())){
            return {
                "message": "Cannot insert something that is already there!",
                "validationStatus": false,
            };
        }

        return {
            "message": "",
            "validationStatus": true,
        };
    }

    async insert(): Promise<ReturnedFromUser>{
        const validation = await this._validateBeforeInserting();
        if (!validation.validationStatus){
            return {
                "message": validation.message,
                "loginStatus": false,
            };
        }
        if (!this.id){
            this.id = uuid();
        }

        try{
            await pool.execute('INSERT INTO `users`(`id`, `login`, `createdAt`, `password`) VALUES(:id, :login, :createdAt, :password)', {
            id: this.id,
            login: this.login.toLowerCase(),
            createdAt: this.createdAt,
            password: this.password,
        });
            //@TODO think of creating another table or columns to manage roles, nut firts let's finish app
        return {
                "message": "User created",
                "loginStatus": false,
            };
        } catch {
            return {
                "message": "User could not be created",
                "loginStatus": false,
            };
        }
    }

    async deleteUser(): Promise<void>{

    }

    static async login(login: string, password: string): Promise<boolean>{

        return
    }

    static async getOne(login: string): Promise<User | null> {
        const [results]= await pool.execute("SELECT * FROM `users` WHERE `login` = :login", {
            login,
        }) as UserRecordResults;

        return results.length === 0 ? null : new User(results[0]);
    }

    async updateOne(): Promise<void>{

    }

    async addToBasket(): Promise<void>{

    }

    async deductFromBasket(): Promise<void>{

    }
}