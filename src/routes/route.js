const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')

const {authentication,authorisation} = require('../middleware/middleware')



router.post('/login', userController.userlogin)

router.post('/register', userController.createUser)

router.post('/books',authentication,authorisation,bookController.createBooks )

router.get('/books', authentication,bookController.getBooksByQuery )

router.get('/books/:bookId',authentication,bookController.getBookById )

router.put('/books/:bookId' ,authentication,authorisation, bookController.updateBooks)

router.delete('/books/:bookId',authentication,authorisation, bookController.deleteBook)

module.exports = router
