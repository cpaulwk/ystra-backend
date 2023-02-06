const request= require('supertest');
const app=require('./app');

it('products/all/:token',async ()=>{
    const res= await request(app).get('/products/all/eSQP5hqbFs90_layrkGm2RORf4ZaYeoh')

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    // expect(res.body.Products).toEqual([...]);
})