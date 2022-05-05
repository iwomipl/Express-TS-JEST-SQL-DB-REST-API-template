import {UserEntity} from './user.entity';

export interface ListOfUsersRes {
    users: UserEntity[];
}

export interface ReturnedFromUser {
    message: string;
    loginStatus: boolean;
}
