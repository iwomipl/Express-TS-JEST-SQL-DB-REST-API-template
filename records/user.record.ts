import {ListOfUsersRes, UserEntity} from "../types";

export class User implements UserEntity{
    public id?: string;
    public email: string;
    public createdAt: Date;
    public lastLoggedIn?: Date;
    public password: string;

    constructor(obj: UserEntity){

    }
    async insert(): Promise<void>{

    }
    static async listAll(): Promise<ListOfUsersRes | null>{

        return null;
    }

    static async getOne(id: string): Promise<UserEntity>{

        return;
    }

    async updateOne(): Promise<void>{

    }


}