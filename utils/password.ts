import { hash, compare, genSalt } from 'bcrypt';
import { config } from '../config/config';


export const hashThePass = async (password: string): Promise<string | null>=>{
    const salt: string =  await genSalt(config.saltOrRounds);
    return await  hash(password, salt);
}

export const compareHashedPasswordToTheOneFromDb = async (password: string, hashedPassword: string): Promise<boolean>=>{
    return await compare(password, hashedPassword);
}
