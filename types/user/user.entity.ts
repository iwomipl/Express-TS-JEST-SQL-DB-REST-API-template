export interface UserEntity{
    id?: string;
    login: string;
    createdAt?: Date | null;
    lastLoggedIn?: Date | null;
    password: string;
}