const BaseRepository = require('./base/baseRepository');

class CarCategoryRepository extends BaseRepository {
    constructor({ file }) {
        super({ file });
    }

    async findByCategoryName(carCategoryName) {
        const carCategory = await super.findByAttribute('name', carCategoryName);
        return carCategory;
    }
}

module.exports = CarCategoryRepository;