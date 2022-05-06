import {User} from "../records/user.record";

let user: User;

beforeAll(async ()=>{
    user = new User({
        email: 'a@b.c',
        password: '1234',
    });
})

test('User Should be able to create account/ new User in db', async ()=>{
    await expect(await user.insert()).toEqual({
        "message": "User created",
        "loginStatus": false,
    });
});

test('User Should not be able to log in with wrong login', async ()=>{
    user.email =  'a@b.casa';

    await expect(async ()=> await User.login(user.email, user.password)).toEqual({
       "message": "Login or Password incorrect",
       "loginStatus": false,
   });
});

test('User Should not be able to log in with empty login', async ()=>{
    user.email = '';
    expect(async ()=> await User.login(user.email, user.password)).toThrow();
});

test('User Should not be able to log in with wrong password', async ()=>{
    user.password = '23s4';
    expect(async ()=> await User.login(user.email, user.password)).toEqual({
        "message": "Login or Password incorrect",
        "loginStatus": false,
    });
});

test('User Should be able to log in with good login and password', async ()=>{
    expect(async ()=> await User.login(user.email, user.password)).toEqual({
        "message": "You are logged in",
        "loginStatus": true,
    });
});
