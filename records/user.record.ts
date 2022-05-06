import {ReturnedFromUser, UserEntity} from "../types";
import {v4 as uuid} from 'uuid';
import { pool } from "../utils/db";

export class User implements UserEntity{
    public id?: string;
    public email: string;
    public createdAt?: Date;
    public lastLoggedIn?: Date;
    public password: string;

    constructor(obj: UserEntity){
     this.id = obj.id || uuid();
     this.email = obj.email;
     this.createdAt = obj.createdAt || null;
     this.lastLoggedIn = obj.lastLoggedIn || null;
     this.password = obj.password;
    }
    async _validateNewUser(){

    }
    async insert(): Promise<ReturnedFromUser>{
        this.createdAt = new Date(new Date().toLocaleDateString());

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
            } as ReturnedFromUser;
        } catch {
            return {
                "message": "User could not be created",
                "loginStatus": false,
            } as ReturnedFromUser;
        }
    }

    async deleteUser(): Promise<void>{

    }

    static async login(email: string, password: string): Promise<boolean>{

        return
    }

    static async getOne(id: string): Promise<UserEntity>{

        return;
    }

    async updateOne(): Promise<void>{

    }

    async addToBasket(): Promise<void>{

    }

    async deductFromBasket(): Promise<void>{

    }




}