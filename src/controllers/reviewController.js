const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel');
const mongoose = require('mongoose');

// -----------------------------------validations--------------------------------------------------
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const checkstring = function (value) {
    let regex =  /^[a-z\s]+$/i
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
    let regex =/^[0-5]$/
   return regex.test(value)
}



//======================================== Crete review ====================================//

const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter enter valid bookId" })
        if(!bookId) return res.status(400).send({status:false, message:"Enter bookId in pathparam"})


        let data = req.body
        let { reviewedBy, rating, review } = data;
        data["bookId"] = bookId
        data["reviewedAt"] = Date.now()
        if (!isVAlidRequestBody(data)) return res.status(400).send({ status: false, message: "Please enter review details in body" })

        if(reviewedBy)
        {
        if(!checkstring(reviewedBy)) return res.status(400).send({status:false, message:"Pleae enter valid reviewedBy"})
        if(!isValid(reviewedBy)) return res.status(400).send({status:false, message:"Pleae enter valid reviewedBy"})
        }
        
    
        if(!isvalidrating(rating)) return res.status(400).send({status:false, message:"Pleae enter valid rating"})

       
        if(!checkstring(review)) return res.status(400).send({status:false, message:"Pleae enter valid review"})

        let findbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findbook) return res.status(404).send({ status: false, message: "Book nod found or book is deleted" })

        let reviewCreated = await reviewModel.create(data)
        let reviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: findbook.reviews + 1 } }, { new: true })

        let bookwithreviewdata =
        {
            title:findbook.title,
            excerpt:findbook.excerpt,
            userId:findbook.userId,
            ISBN:findbook.ISBN,
            category:findbook.category,
            subcategory:findbook.subcategory,
            releasedAt:findbook.releasedAt,
            reviews:reviewCount.reviews,
            reviewdata: reviewCreated
        }
        return res.status(201).send({ status: true, message: "review created successfully", data: bookwithreviewdata })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




const updateReview = async function(req,res){
    try {
        
    let data = req.params;
    let {bookId, reviewId} = data;

    let body = req.body;

    let checkBook = await bookModel.findOne({_id:bookId, isDeleted:false})
    
    await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted:false},{$set:body}, {new:true})
    
    let getallReview = await reviewModel.find({bookId:bookId, isDeleted:false}).select({_id:1, bookId:1, reviewedBy:1 , reviewedAt:1, rating:1,review:1})
    console.log(getallReview)

    let bookwithreviewdata =
        {
            _id:checkBook._id,
            title:checkBook.title,
            excerpt:checkBook.excerpt,
            userId:checkBook.userId,
            ISBN:checkBook.ISBN,
            category:checkBook.category,
            subcategory:checkBook.subcategory,
            reviews:checkBook.reviews,
            releasedAt:checkBook.releasedAt,
            createdAt:checkBook.createdAt,
            updatedAt:checkBook.updatedAt,
            reviewsdata: getallReview
        }
    

    return res.status(200).send({status:true, data:bookwithreviewdata})

} catch (error) {
        return res.status(500).send({status:false, message:error.message})
}

}




const deleteReview=async function(req,res){

    try{
        const bookId=req.params.bookId
        if(!isValidObjectId(bookId))
        return res.status(400).send({status:false,message:"enter valid book id"})
    
        const reviewId =req.params.reviewId
        if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"enter valid review Id"})
    
        let checkbookId =await bookModel.findOne ({isDeleted: false, _id: bookId})
        if(!checkbookId)return res.status(404).send({status:false,message:"No book found or It May Be Deleted"})
    
    
        let checkreviewId=await reviewModel.findOne ({isDeleted: false, _id: reviewId})
        if(!checkreviewId)return res.status(404).send({status:false,message:"No review data found or It May Be Deleted"})
    
    
        let reviewBookid= checkreviewId.bookId
    
    
        if(bookId != reviewBookid)return res.status(404).send({status:false,message:"No book id found which matches with the review book documnet"})
    
        let deleteReview= await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted:false},{$set:{isDeleted:true}},{new:true})
        let decreaseReview= await bookModel.findOneAndUpdate({_id:bookId , isDeleted:false},{$inc:{reviews:-1}},{new:true})
        res.status(200).send({status:true, message:"deleted successfully"})
    }
    catch(err){
        return res.status(500).send({ status: false, message: " server Error", error: err.messag})
    }
}


module.exports = {createReview, deleteReview, updateReview }