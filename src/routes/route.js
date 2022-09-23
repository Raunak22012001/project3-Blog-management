const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')

const {authentication,authorisation} = require('../middleware/middleware')



router.post('/register', userController.createUser)

router.post('/books',authentication, authorisation, bookController.createBooks)

router.post('/login', userController.userlogin)


router.get('/books', authentication,bookController.getBooksByQuery )

router.get('/books/:bookId',authentication,bookController.getBookById )

router.put('/books/:bookId' ,authentication,authorisation, bookController.updateBooks)

router.delete('/books/:bookId',authentication,authorisation, bookController.deleteBook)



router.all("/**",  (req, res) => {
    res.status(404).send({ status: false, msg: "The api you request is not available" })
});


module.exports = router
