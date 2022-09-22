const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')

const {authentication,authorisation} = require('../middleware/authentication')



router.post('/login', userController.userlogin)

router.post('/register', userController.createUser)

router.post('/books',authentication,bookController.createBooks )

router.get('/books', bookController.getBooksByQuery )

router.get('/books/:bookId',authentication, bookController.getBookById )


module.exports = router
