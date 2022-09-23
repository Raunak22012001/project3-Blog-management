const bookModel = require('../models/bookModel');
//const userModel = require('../models/userModel');
const userController = require('../controllers/usercontroller');
const mongoose = require('mongoose');

// ==================================== validations ===================================//

const Validation = userController.isValid;


const checkstring = function (value) {
    let regex = /^[a-z\s]+$/i
    return regex.test(value)
}

const isVAlidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const checkISBN = function (value) {
    let regex = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/
    return regex.test(value)
}

// ============================================= Create Books ======================================= // 

const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        if (!isVAlidRequestBody(data)) return res.status(400).send({ status: false, message: "please enter books details" })

        if (!Validation(title)) return res.status(400).send({ status: false, message: "use correct title which is mandatory " })
        if (!checkstring(title)) return res.status(400).send({ status: false, message: "Please enter valid title" })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(409).send({ status: false, message: "title already exist" })


        if (checkTitle) return res.status(400).send({ status: false, message: "title already exist" })

        if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please use correct excerpt" })
        if (!checkstring(excerpt)) return res.status(400).send({ status: false, message: "Please enter valid title" })

        if (!Validation(userId)) return res.status(400).send({ status: false, message: "please use userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })


        let checkIsbn = await bookModel.findOne({ ISBN })
        if (checkIsbn) return res.status(409).send({ status: false, message: "ISBN already exist" })
        if (!Validation(ISBN)) return res.status(400).send({ status: false, message: "use correct ISBN" })
        if (!checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })


        if (!Validation(category)) return res.status(400).send({ status: false, message: "please use correct category" })
        if (!checkstring(category)) return res.status(400).send({ status: false, message: "Please enter valid title" })

        if (!Validation(subcategory)) return res.status(400).send({ status: false, message: "please use correct subcategory" })
        if (!checkstring(subcategory)) return res.status(400).send({ status: false, message: "Please enter valid title" })

        if (!Validation(releasedAt)) return res.status(400).send({ status: false, message: "please use correct releasedDate" })
        

        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: createBook })
    } 
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// =============================================== Get Books By Query ==================================== //

const getBooksByQuery = async function (req, res) {
    try {
        let data = req.query
        let { userId, category, subcategory } = data

        if (Object.keys(data).length == 0)
        {
            let allBooks = await bookModel.find({ isDeleted: false })
            let bookData =allBooks.sort((a, b) => a.title.localeCompare(b.title))
            return res.status(200).send({ status: true, message: "all books", data: bookData })
        }

        let filter = {}

        if (!userId == userId || userId == "") return res.status(400).send({ status: false, message: "use correct userId" })
        if (userId)
        {
            if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })
            filter.userId = userId


        }

        if (!category == category || category == "") return res.status(400).send({ status: false, message: "use correct category" })
        if (category)
        {
            if (!checkstring(category)) return res.status(400).send({ status: false, message: "The category can contain only alphabets" })
            filter.category = category
        }

        if (!subcategory == subcategory || subcategory == "") return res.status(400).send({ status: false, message: "use correct subcategory" })
        if (subcategory) 
        {
            if (!checkstring(subcategory)) return res.status(400).send({ status: false, message: "The subcategory can contain only aplhabets" })
            filter.subcategory = subcategory
        }

        filter.isDeleted = false


        if (userId || category || subcategory) 
        {
            let books = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, isDeleted: 1 })

            if (Object.keys(books).length == 0) return res.status(404).send({ status: false, message: "there is no data with this filter" })


            return res.status(200).send({ status: true, message: "All books", count: books.length, data: books })
        }

        else 
        {
            return res.status(400).send({ status: false, message: "The filter can be only userId, category or subcategory" })
        }
    }

    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

// ============================================= Get Books By Id ================================//

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })


        let booksWithId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!booksWithId) return res.status(404).send({ status: false, message: "Books not found or already deleted" })
        return res.status(200).send({ status: true, message: "Particular books", data: booksWithId })
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


// ========================================= Update Books =============================================//


const updateBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })

        let chekdBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!chekdBooks) return res.status(404).send({ status: false, message: "Book is deleted" })

        let data = req.body
        let { title, excerpt, releasedAt, ISBN } = data
        if (!isVAlidRequestBody(data)) return res.status(400).send({ status: false, message: "please enter updation details" })

        let updations = {}

        if (title) 
        {
            if (!Validation(title)) return res.status(400).send({ status: false, message: "please enter title" })
            
            updations.title = title
            let checkTitle = await bookModel.findOne({ title: title })
            if (checkTitle) return res.status(409).send({ status: false, message: "title already exist" })
        }

        if (excerpt) 
        {
            if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please enter excerpt" })
            if (!checkstring(excerpt)) return res.status(400).send({ status: false, message: "excerpt must contain only alphabets" })
            updations.excerpt = excerpt
        }

        if (releasedAt) 
        {
            if (!Validation(releasedAt)) return res.status(400).send({ status: false, message: "please enter title" })
            updations.releasedAt = releasedAt
        }
        if (ISBN) 
        {
            if (!Validation(ISBN)) return res.status(400).send({ status: false, message: "please enter ISBN" })
            if (!checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
            updations.ISBN = ISBN
            let checkISBNindb = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBNindb) return res.status(404).send({ status: false, message: "ISBN already exist" })
        }

        if (title || excerpt || releasedAt || ISBN) 
        {
            let updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updations }, { new: true })
            return res.status(201).send({ status: true, message: "Updation successfull", data: updatedBooks })
        }
        else 
        {
            return res.status(400).send({ status: false, message: "The filter can be only title ,excerpt ,releasedAt ,ISBN" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }

}


// ============================================ Delete Books ====================================== //

const deleteBook = async function (req, res) {

    try {

        let bookId = req.params.bookId

        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Invalid Book Id. please Enter the valid Book Id" })

        const getbook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!getbook)
            return res.status(404).send({ status: false, message: "No book found or it may be deleted" })

        const deleteBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
       
        return res.status(200).send({ status: true, message: "successfully deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}


module.exports = { createBooks, getBooksByQuery, getBookById, updateBooks, deleteBook }
