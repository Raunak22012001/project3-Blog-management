const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')



router.post('/login', userController.userlogin)

router.post('/register', userController.createUser)

router.post('/books',bookController.createBooks )

router.get('/books', bookController.getBooksByQuery )

router.get('/books/:bookId',bookController.getBookById )

router.put('/books/:bookId' , bookController.updateBooks)

router.delete('/books/:bookId', bookController.deleteBook)

// router.get('/books/:bookId', bookController.getBooksPath)

// router.delete('/books/:bookId', bookController.deleteBooks)


router.all("/**",  (req, res) => {
    res.status(404).send({ status: false, msg: "The api you request is not available" })
});


module.exports = router
