const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const userController = require('../controllers/usercontroller');
const Validation = userController.isValid;
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};



const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;


        if (!Validation(title)) return res.status(400).send({ status: false, message: "use correct title which is mandatory " })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle.title == title) return res.status(400).send({ status: false, message: "title already exist" })


        if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please use correct excerpt" })

        if (!Validation(userId)) return res.status(400).send({ status: false, message: "please use userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })


        let checkIsbn = await bookModel.findOne({ ISBN: ISBN })
        if (checkIsbn.ISBN == ISBN) return res.status(400).send({ status: false, message: "ISBN already exist" })
        if (!Validation(ISBN)) return res.status(400).send({ status: false, message: "use correct ISBN" })


        if (!Validation(category)) return res.status(400).send({ status: false, message: "please use correct category" })

        if (!Validation(subcategory)) return res.status(400).send({ status: false, message: "please use correct subcategory" })

        if (!Validation(releasedAt)) return res.status(400).send({ status: false, message: "please use correct releasedDate" })


        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: createBook })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBooksByQuery = async function (req, res) {
    try {
        let data = req.query
        let { userId, category, subcategory } = data;
        if (!userId) return res.status(400).send({ status: false, message: "please use userId to get data" })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })

        let checkUserId = await userModel.findById({ _id: userId })
        if (!checkUserId) return res.status(404).send({ status: false, message: "invalid userId" })

        let books = await bookModel.find({ userId, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 });

        return res.status(200).send({ status: true, msg: "Book list", data: books });

        //let data1 = await bookModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }]})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createBooks, getBooksByQuery }

// POST /books
// Create a book document from request body. Get userId in request body only.
// Make sure the userId is a valid userId by checking the user exist in the users collection.
// Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like this
// Create atleast 10 books for each user
// Return HTTP status 400 for an invalid request with a response body like this