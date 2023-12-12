const BaseRepository = require('./../repository/base/baseRepository')
const Tax = require('../entities/tax');
const Transaction = require('../entities/transaction');

class CarService {
    constructor({ cars }) {
        this.carRepository = new BaseRepository({ file: cars });
        this.taxesBaseOnAge = Tax.taxedBasedOnAge;
        this.currencyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    getRandomPositionFromArray(list) {
        const pos = parseInt(Math.random() * list.length);
        return list[pos];
    }

    chooseRandomCar(carCategory) {
        const indexRandom = this.getRandomPositionFromArray(carCategory.carIds)

        const carId = carCategory.carIds[indexRandom];

        return carId;
    }

    async getAvailableCar(carCategory) {
        const carId = this.chooseRandomCar(carCategory);

        const car = await this.carRepository.find(carId)

        return car;
    }

    calculateFinalPrice(customer, carCategory, numberOfDays) {
        const { age } = customer;
        const { price } = carCategory;

        const { then: tax } = this.taxesBaseOnAge.find(tax => age >= tax.from && age <= tax.to)  

        return this.currencyFormat.format((price * tax) * numberOfDays);
    }

    async rent(customer, carCategory, numberOfDays) {
        const car = await this.getAvailableCar(carCategory);
        const finalPrice = await this.calculateFinalPrice(customer, carCategory, numberOfDays);

        const today = new Date();
        today.setDate(today.getDate() + numberOfDays);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        const dueDate = today.toLocaleDateString('pt-br', options);

        const transaction = new Transaction({
            customer,
            dueDate,
            car,
            amount: finalPrice
        });

        return transaction;
    }
}

module.exports = CarService;