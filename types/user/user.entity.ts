export interface UserEntity{
    id?: string;
    email: string;
    createdAt?: Date | null;
    lastLoggedIn?: Date | null;
    password: string;
}