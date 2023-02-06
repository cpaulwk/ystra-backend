const {checkBody} =require('./modules/checkBody');

it('checkBody',()=>{
    const result=checkBody({username :'username', password:'password',email:'password'}
                        ,['username', 'password','email'])

    expect(result).toBe(true);
});