const reviewModel = require('../models/reviewModel')

const bookModel = require('../models/bookModel');

const mongoose = require('mongoose');
const { find } = require('../models/userModel');

// ====================================== validations =========================================//



const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const checkstring = function (value) {
    let regex = /^[a-z\s]+$/i
    return regex.test(value)
}

const isVAlidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof data === 'string' && data.trim().length == 0) return false
    return true
}

const isvalidrating = function (value) {
    let regex = /^[0-5](.[5]?)?$/
    return regex.test(value)
}


//======================================== Crete review =============================================//

const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })
        if (!bookId) return res.status(400).send({ status: false, message: "Enter bookId in pathparam" })


        let data = req.body
        let { reviewedBy, rating, review } = data;
        data["bookId"] = bookId
        data["reviewedAt"] = Date.now()

        if (!isVAlidRequestBody(data)) return res.status(400).send({ status: false, message: "Please enter review details in body" })

        if (reviewedBy) {
            if (!checkstring(reviewedBy)) return res.status(400).send({ status: false, message: "Pleae enter valid reviewedBy" })
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Pleae enter valid reviewedBy" })
        }


        if (!isvalidrating(rating)) return res.status(400).send({ status: false, message: "Pleae enter valid rating" })


        if (!checkstring(review)) return res.status(400).send({ status: false, message: "Pleae enter valid review" })

        let findbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findbook) return res.status(404).send({ status: false, message: "Book not found or book is deleted" })

        //if (!findbook) return res.status(404).send({ status: false, message: "Book nod found or book is deleted" })
       
        let reviewCreated = await reviewModel.create(data)
        // console.log(reviewCreated)
        let findreview = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        // console.log(findreview)
        let reviewCount = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { reviews: findbook.reviews + 1 } }, { new: true })

        
        

        let bookwithreviewdata =
        {
            title: findbook.title,
            excerpt: findbook.excerpt,
            userId: findbook.userId,
            ISBN: findbook.ISBN,
            category: findbook.category,
            subcategory: findbook.subcategory,
            releasedAt: findbook.releasedAt,
            reviews: reviewCount.reviews,
            reviewdata: reviewCreated
        }
        return res.status(201).send({ status: true, message: "Review creation is successful", data: bookwithreviewdata  })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// ======================================== Update review ============================================= //

const updateReview = async function (req, res) {
    try {

        let data = req.params;
        let { bookId, reviewId } = data;

        if (!bookId) return res.status(400).send({ status: false, message: "Enter bookId in pathparams" })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })

        if (!reviewId) return res.status(400).send({ status: false, message: "Enter reviewId in pathparams" })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Please enter valid reviewId" })

        let body = req.body;

        let { reviewedBy, rating, review } = body

        if (!isVAlidRequestBody(body)) return res.status(400).send({ status: false, message: "Please enter upadation details in body" })

        if (reviewedBy) {
            if (!checkstring(reviewedBy)) return res.status(400).send({ status: false, message: "Please enter valid reviewedBy" })
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please enter reviewedBy" })
        }


        if (rating) {
            if (!isvalidrating(rating)) return res.status(400).send({ status: false, message: "Pleae enter valid rating" })
        }

        if (review) {
            
           // if (!checkreview(review)) return res.status(400).send({ status: false, message: "Pleae enter valid review" })
            if (!isValid(review)) return res.status(400).send({ status: false, message: "Please enter review" })
        }



        let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBook) return res.status(404).send({ status: false, message: "No book found with this bookId or it may be deleted" })


        if (reviewedBy || rating || review) {

            let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: body }, { new: true }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
            if (!updatedReview) return res.status(404).send({ status: false, message: "No review for this reviewId or it may be deleted" })


            let reviewBookid = updatedReview.bookId

            if (!bookId == reviewBookid) return res.status(404).send({ status: false, message: "No book id found which matches with the review book document" })

            let checkbooks = checkBook._doc

            checkbooks['updatedReview'] = updatedReview


            return res.status(200).send({ status: true, mesaage:"Review update is successful",data: checkbooks })
        }
        else return res.status(400).send({ status: false, message: " update only from reviewedBy, rating, review" })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//_____________________________________Delete review By Book Id _________________________________________//

const deleteReview = async function (req, res) {

    try {
        const bookId = req.params.bookId

        const reviewId = req.params.reviewId

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "enter valid review Id" })

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "enter valid book Id" })

        let deleteReview = await reviewModel.findOneAndUpdate({ $and: [{ _id: reviewId }, { isDeleted: false }] }, { $set: { isDeleted: true } }, { new: true });

        if (!deleteReview) return res.status(404).send({ status: false, message: "No review found with this reviewId or may be deleted" })

        let reviewBookid = deleteReview.bookId


        if (bookId != reviewBookid) return res.status(404).send({ status: false, message: "No book id found which matches with the review book documnet" })

        let decreaseReview = await bookModel.findOneAndUpdate({ $and: [{ _id: bookId }, { isDeleted: false }] }, { $inc: { reviews: -1 } }, { new: true });

        if (!decreaseReview) return res.status(404).send({ status: false, message: "No book found with this bookId or it may be deleted" })
        res.status(200).send({ status: true, message: "deleted successfully", deleteReview: deleteReview, decreaseReview: decreaseReview })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: " server Error", error: err.messag })
    }
}


module.exports = { createReview, deleteReview, updateReview }
