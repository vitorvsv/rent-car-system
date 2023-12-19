const CustomerRepository = require('../repository/customerRepository')

class CustomerService {
    constructor({ customers }) {
        this.customerRepository = new CustomerRepository({ file: customers });
    }

    async getCustomer(customerId) {
        const customer = await this.customerRepository.find(customerId);
        return customer;
    }
}

module.exports = CustomerService;