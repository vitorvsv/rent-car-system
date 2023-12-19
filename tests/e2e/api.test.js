const { join } = require('path');
const assert = require('assert');

const { describe, it, after, before } = require('mocha');
const supertest = require('supertest');

const CarService = require('../../src/service/carService');

const carsDatabase = join(__dirname, '../../database', 'cars.json');

const mocks = {
    validCar: require('../mocks/valid-car.json'),
    validCarCategory: require('../mocks/valid-carCategory.json'),
    validCustomer: require('../mocks/valid-customer.json'),
}

describe('API test suite', () => {
    let server;

    before((done) => {
        server = require('../../src/server')
        server.once('listening', done)
    })

    after(done => server.close(done))

    it('Should return an error 400 with text "Invalid params!"', async () => {
        const res = await supertest(server)
            .get('/rent-car')
            .expect(400);

        assert.strictEqual(res.text, 'Invalid params!');
    })

    it('Should return the correct customer and amount when called /rent-car route', async () => {
        const carCategory = mocks.validCarCategory;
        const customer = mocks.validCustomer;
        const numberOfDays = 5;

        const res = await supertest(server)
            .get('/rent-car')
            .query(`category=${carCategory.name}`)
            .query(`customerId=${customer.id}`)
            .query(`numberOfDays=${numberOfDays}`)
            .expect(200);

        const { text: body } = res;
        const { customer: customerReturned, amount: returnedAmount } = JSON.parse(body);
       
        const carService = new CarService({ cars: carsDatabase });

        const expectedAmount = carService.calculateFinalPrice(customer, carCategory, numberOfDays);

        assert.deepStrictEqual(customerReturned, customer);
        assert.deepStrictEqual(returnedAmount, expectedAmount);
    })
})