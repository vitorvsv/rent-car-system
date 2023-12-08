const { describe, it, before, beforeEach, afterEach } = require('mocha')

const { join } = require('path')
const { expect } = require('chai')
const sinon = require('sinon');

const CarService = require('../../src/service/carService');

const carsDatabase = join(__dirname, './../../database', 'cars.json')

const mocks = {
    validCar: require('../mocks/valid-car.json'),
    validCarCategory: require('../mocks/valid-carCategory.json'),
    validCustomer: require('../mocks/valid-customer.json'),
}

describe('CarService Suite Tests', () => {
    let carService = {}
    let sandbox = {}

    before(() => {
        carService = new CarService({ cars: carsDatabase })
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    // This guarantee the correct functionality of getRandomPositionFromArray function
    it('Should return a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]

        const result = carService.getRandomPositionFromArray(data)

        expect(result).to.be.lte(data.length).and.be.gte(0)
    })

    // how the getRandomPositionFromArray has already been tested
    // we can use a stub to mock the return to zero and make this test pass
    it('Should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory;
        const carIdIndex = 0;

        sinon.stub(
            carService,
            carService.getRandomPositionFromArray.name
        ).returns(carIdIndex)

        const result = carService.chooseRandomCar(carCategory);
        const expected = carCategory.carIds[carIdIndex];

        expect(result).to.be.equal(expected)

        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    })


    it('Given a car category it should return an available car', async () => {
        const car = mocks.validCar;
        const carCategory = Object.create(mocks.validCarCategory);

        carCategory.carIds = [car.id];

        // mocking the database query for a car
        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car)

        sandbox.spy(
            carService,
            carService.chooseRandomCar.name
        )

        const result = await carService.getAvailableCar(carCategory);
        const expected = car;

        expect(carService.chooseRandomCar.calledOnce).to.be.ok;
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
        expect(result).to.be.deep.equal(expected)
    })
})
