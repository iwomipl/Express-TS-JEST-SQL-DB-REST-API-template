// let user: UserRecord;

test('User Should not be able to log in with wrong login', async ()=>{
    expect(async ()=> await user.login('a@b.casa', '1234')).toEqual({
       "message": "Login or Password incorrect",
       "loginStatus": false,
   });
});

test('User Should not be able to log in with empty login', async ()=>{
    expect(async ()=> await user.login('', '1234')).toThrow();
});

test('User Should not be able to log in with wrong password', async ()=>{
    expect(async ()=> await user.login('a@b.c', '23s4')).toEqual({
        "message": "Login or Password incorrect",
        "loginStatus": false,
    });
});

test('User Should not be able to log in with empty password', async ()=>{
    expect(async ()=> await user.login('a@b.c', '23s4')).toEqual({
        "message": "Login or Password incorrect",
        "loginStatus": false,
    });
});

test('User Should not be able to log in with no password', async ()=>{
    expect(async ()=> await user.login('a@b.c')).toEqual({
        "message": "Login or Password incorrect",
        "loginStatus": false,
    });
});


test('User Should be able to log in with good login and password', async ()=>{
    expect(async ()=> await user.login('a@b.c', '1234')).toEqual({
        "message": "You are logged in",
        "loginStatus": true,
    });
});
