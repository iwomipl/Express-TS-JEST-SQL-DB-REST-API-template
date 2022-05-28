import {UserEntity} from './user.entity';

//future developement for admin view
export interface ListOfUsersRes {
    users: UserEntity[];
}

//while creating user in router i'm creating new User without few not yet added variables
export type CreateUserReq =  Omit<UserEntity, 'id' | 'createdAt' | 'lastLoggedIn'>

//this is what API should return, the name will change and will be more precise
export interface ReturnedFromUser {
    message: string;
    loginStatus: boolean;
    token?: string | null;
}

export interface ReturnedFromValidation extends Omit<ReturnedFromUser, 'loginStatus'> {
    validationStatus: boolean;
}
