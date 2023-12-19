const BaseRepository = require('./base/baseRepository');

class CustomerRepository extends BaseRepository {
    constructor({ file }) {
        super({ file });
    }
}

module.exports = CustomerRepository;