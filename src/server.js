const http = require('node:http');
const { join } = require('path');

const CarService = require('./service/carService');
const CustomerService = require('./service/customerService');
const CarCategoryService = require('./service/carCategoryService');

const carsDatabase = join(__dirname, '../database', 'cars.json');
const customerDatabase = join(__dirname, '../database', 'customers.json');
const carCategoriesDatabase = join(__dirname, '../database', 'carCategories.json');

const ROUTES = {
    '/rent-car:GET': async (req, res, params) => {
        const { category, customerId, numberOfDays } = params;

        const isThereAnyParamInvalid = [category, customerId, numberOfDays].some(param => !param);

        if (isThereAnyParamInvalid) {
            res.writeHead(400);
            return res.end('Invalid params!');
        }

        const customerService = new CustomerService({ customers: customerDatabase });
        const customer = await customerService.getCustomer(customerId);

        const carCategoryService = new CarCategoryService({ carCategories: carCategoriesDatabase });
        const carCategory = await carCategoryService.getCarCategory(category);

        const carService = new CarService({ cars: carsDatabase });       
        const rent = await carService.rent(customer, carCategory, +numberOfDays);

        res.writeHead(200);
        return res.end(JSON.stringify(rent));
    }
}

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    const [path, queryParams] = url.split('?');

    const queryParamsConvertedToObj = {};

    queryParams && queryParams.split('&').map(queryParam => {
        const [name, value] = queryParam.split('=');
        queryParamsConvertedToObj[name] = value;
    });

    const route = ROUTES[`${path}:${method.toUpperCase()}`];

    await route(req, res, queryParamsConvertedToObj);
});

server.listen(3000);

module.exports = server;