const bookModel = require('../models/bookModel');

const reviewModel = require('../models/reviewModel');

const updateReview = async function(req,res){
    let data = req.params;
    let {bookId, reviewId} = data;

    let body = req.body;

    let {review, rating, value} = body
    let checkBook = await bookModel.findOne({_id:bookId, isDeleted:false})
    let checkReviewAndupdate = await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted:false}, {$set:{review:review, rating:rating, value:value}}, {new:true}).populate("Book")

    let bookwithReview = {

    }


}



// PUT /books/:bookId/review/:reviewId
// Update the review - review, rating, reviewer's name.
// Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like this if the book does not exist
// Get review details like review, rating, reviewer's name in request body.
// Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this