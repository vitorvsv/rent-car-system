const CarCategoryRepository = require('../repository/carCategoryRepository')

class CarCategoryService {
    constructor({ carCategories }) {
        this.carCategoryRepository = new CarCategoryRepository({ file: carCategories });
    }

    async getCarCategory(carCategoryName) {
        const carCategory = await this.carCategoryRepository.findByCategoryName(carCategoryName);
        return carCategory;
    }
}

module.exports = CarCategoryService;