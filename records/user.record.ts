import { ReturnedFromUser, ReturnedFromValidation, UserEntity} from "../types";
import {v4 as uuid} from 'uuid';
import { pool } from "../utils/db";
import {FieldPacket} from "mysql2";
import { ValidationError } from "../utils/errors";

export type UserRecordResults = [UserEntity[], FieldPacket[]]

export class User implements UserEntity{
    public id?: string;
    public email: string;
    public createdAt?: Date;
    public lastLoggedIn?: Date;
    public password: string;

    constructor(obj: UserEntity){
        if (!obj.email || obj.email.length < 4 || obj.email.length > 25 ) {
            throw new ValidationError('You must give a proper email address.');
        }
     this.id = obj.id;
     this.email = obj.email;
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
        if (await User.getOne(this.email)){
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
            await pool.execute('INSERT INTO `users`(`id`, `email`, `createdAt`, `password`) VALUES(:id, :email, :createdAt, :password)', {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt,
            password: this.password,
        });

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

    static async login(email: string, password: string): Promise<boolean>{

        return
    }

    static async getOne(email: string): Promise<User | null> {
        const [results]= await pool.execute("SELECT * FROM `users` WHERE `email` = :email", {
            email,
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