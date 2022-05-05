export interface UserEntity{
    id?: string;
    email: string;
    createdAt?: Date;
    lastLoggedIn?: Date;
    password: string;
}