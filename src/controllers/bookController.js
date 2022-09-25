const bookModel = require('../models/bookModel');

const reviewModel = require('../models/reviewModel');

const userController = require('../controllers/usercontroller');

const mongoose = require('mongoose');

// ==================================== validations ========================================= //

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
    let regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    return regex.test(value)
}
const checkreleasedAt = function (value) {
    let regex = /^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/
    return regex.test(value)
}
// ============================================= Create Books ======================================= // 

const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        if (!isVAlidRequestBody(data)) return res.status(400).send({ status: false, message: "please enter books details" })

        if (!Validation(title)) return res.status(400).send({ status: false, message: "use correct title which is mandatory " })
    /////if (!checkstring(title)) return res.status(400).send({ status: false, message: "Please enter valid title" })


        if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please Enter the excerpt or excerpt can not be Empty " })
        if (!checkstring(excerpt)) return res.status(400).send({ status: false, message: "Please enter valid excerpt" })

        if (!Validation(userId)) return res.status(400).send({ status: false, message: "please use userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })


        if (!Validation(ISBN)) return res.status(400).send({ status: false, message: "use correct ISBN or ISBN is Mandetory" })
        if (!checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })

        let checkTitleAndIsbn = await bookModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

        if (checkTitleAndIsbn) {
            if (checkTitleAndIsbn.title == title) return res.status(409).send({ status: false, message: "title already exist" })
            if (checkTitleAndIsbn.ISBN == ISBN) return res.status(409).send({ status: false, message: "ISBN already exist" })
        }


        if (!Validation(category)) return res.status(400).send({ status: false, message: "please enter  category or category can not be Empty " })
        if (!checkstring(category)) return res.status(400).send({ status: false, message: "Please enter valid format of category" })

        if (!Validation(subcategory)) return res.status(400).send({ status: false, message: "please enter correct subcategory" })
        if (!checkstring(subcategory)) return res.status(400).send({ status: false, message: "Please enter valid formant of subcategory" })

        if (!Validation(releasedAt)) return res.status(400).send({ status: false, message: "please enter correct releasedDate" })
        if (!checkreleasedAt(releasedAt)) return res.status(400).send({ status: false, message: "please enter  valid format of  releasedAt" })


        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: createBook })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// =============================================== Get Books By Query ======================================== //

const getBooksByQuery = async function (req, res) {
    try {
        let data = req.query
        let { userId, category, subcategory } = data

        if (Object.keys(data).length == 0) {
            let allBooks = await bookModel.find({ isDeleted: false }).collation({ locale: "en" }).sort({ title: 1 })

            return res.status(200).send({ status: true, message: "all books", data: allBooks })
        }

        let filter = {}

        if (!userId == userId || userId == "") return res.status(400).send({ status: false, message: "use correct userId" })
        if (userId) {
            if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid userId" })

            let checkBookByUserId = await bookModel.find({ userId: userId })

            if (!checkBookByUserId) return res.status(404).send({ status: false, message: "book not found by this userId" })

            filter.userId = userId

        }

        if (!category == category || category == "") return res.status(400).send({ status: false, message: "use correct category" })
        if (category) {
            if (!checkstring(category)) return res.status(400).send({ status: false, message: "The category can contain only alphabets" })
            filter.category = category
        }

        if (!subcategory == subcategory || subcategory == "") return res.status(400).send({ status: false, message: "use correct subcategory" })
        if (subcategory) {
            if (!checkstring(subcategory)) return res.status(400).send({ status: false, message: "The subcategory can contain only aplhabets" })
            filter.subcategory = subcategory
        }

        filter.isDeleted = false


        if (userId || category || subcategory) {
            let books = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, isDeleted: 1 })

            if (Object.keys(books).length == 0) return res.status(404).send({ status: false, message: "there is no data with this filter" })


            return res.status(200).send({ status: true, message: "All books", count: books.length, data: books })
        }

        else {
            return res.status(400).send({ status: false, message: "The filter can be only userId, category or subcategory" })
        }
    }

    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

// ============================================= Get Books By Path params Id ================================//



const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })


        let booksWithId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!booksWithId) return res.status(404).send({ status: false, message: "Books not found or already deleted" })

        //(Object.keys(booksWithId))


        let reviewdata = await reviewModel.find({ bookId: bookId, isDeleted: false }).select("_id bookId rating reviewedBy review reviewedAt")
        //bookwithid has 3 internal keys and the data of book was in ._doc key so to add review key we have to edit bookwithid internally
        const book = booksWithId._doc
        
        book["reviewsdata"] = reviewdata
        
        return res.status(200).send({ status: true, message: "Particular books", data: book })
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

        if (title) {
            if (!Validation(title)) return res.status(400).send({ status: false, message: "please enter title" })

            updations.title = title
        }

        if (excerpt) {
            if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please enter excerpt" })
            if (!checkstring(excerpt)) return res.status(400).send({ status: false, message: "excerpt must contain only alphabets" })
            updations.excerpt = excerpt
        }

        if (releasedAt) {
            if (!Validation(releasedAt)) return res.status(400).send({ status: false, message: "please enter proper releaseAt" })
            updations.releasedAt = releasedAt
        }
        if (ISBN) {
            if (!Validation(ISBN)) return res.status(400).send({ status: false, message: "please enter ISBN" })
            if (!checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
            updations.ISBN = ISBN
        }

        let checkISBNandtitle = await bookModel.findOne({ $or: [{ ISBN: ISBN }, { title: title }] });
        if (checkISBNandtitle) {
            if (checkISBNandtitle.ISBN == ISBN) return res.status(400).send({ status: false, message: "already exist this ISBN" });
            if (checkISBNandtitle.title == title) return res.status(400).send({ status: false, message: "already exist this title" });
        }

        if (title || excerpt || releasedAt || ISBN) {
            let updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updations }, { new: true })
            return res.status(200).send({ status: true, message: "Updation successfull", data: updatedBooks })
        }
        else {
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

        let deleteBook = await bookModel.findOneAndUpdate({ $and: [{ _id: bookId }, { isDeleted: false }] }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        if (!deleteBook) return res.status(404).send({ status: false, message: "No book found or it may be deleted" })

        return res.status(200).send({ status: true, message: "successfully deleted", deleteBook: deleteBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}


module.exports = { createBooks, getBooksByQuery, getBookById, updateBooks, deleteBook }
