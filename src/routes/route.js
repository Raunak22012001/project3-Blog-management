const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')



router.post('/login', userController.userlogin)

router.post('/register', userController.createUser)

router.post('/books', bookController.createBooks )

router.get('/books', bookController.getBooksByQuery )


module.exports = router
