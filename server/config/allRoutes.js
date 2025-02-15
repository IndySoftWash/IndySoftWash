const routes = require('express').Router()

routes.use('/customer', require('../controllers/CustomerController'))
routes.use('/service', require('../controllers/ServiceController'))
routes.use('/admin', require('../controllers/AdminController'))
routes.use('/employee', require('../controllers/EmployeeController'))
module.exports = routes;