import {UserEntity} from "../types";
import {v4 as uuid} from 'uuid';

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

    async insert(): Promise<void>{

    }

    async login(): Promise<boolean>{
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

    async delete(): Promise<void>{

    }


}