const BaseRepository = require('./../repository/base/baseRepository')

class CarService {
    constructor({ cars }) {
        this.carRepository = new BaseRepository({ file: cars });
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
}

module.exports = CarService;