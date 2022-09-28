const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')

const reviewController = require('../controllers/reviewController')

const createcover =require('../AWS/aws')

const {authentication,authorisation} = require('../middleware/middleware')



router.post('/register', userController.createUser)

router.post('/login', userController.userlogin)


router.post('/books',authentication, authorisation, bookController.createBooks)

router.post('/write-files-aws',createcover.createcover)  // AWS

router.get('/books', authentication,bookController.getBooksByQuery)

router.get('/books/:bookId',authentication,bookController.getBookById)

router.put('/books/:bookId' ,authentication,authorisation, bookController.updateBooks)

router.delete('/books/:bookId',authentication,authorisation, bookController.deleteBook)

router.post('/books/:bookId/review', reviewController.createReview)

router.put('/books/:bookId/review/:reviewId' , reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)




router.all("/**",  (req, res) => {
    res.status(400).send({ status: false, msg: "The api you request is not available" })
});


module.exports = router
