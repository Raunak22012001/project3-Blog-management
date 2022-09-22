const bookModel = require('../models/bookModel');

const userController = require('../controllers/usercontroller');

const Validation = userController.isValid;

const mongoose = require('mongoose')

const checkstring = function (value) {
    let regex = /^[a-z\s]+$/i
    return regex.test(value)
}

const isVAlidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};


//============================================= Create Books =============================== // 

const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        if(!isVAlidRequestBody(data) ) return res.status(400).send({status:false, message:"please enter books details"})

        if (!Validation(title)) return res.status(400).send({ status: false, message: "use correct title which is mandatory " })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(409).send({ status: false, message: "title already exist" })

        
        if (checkTitle) return res.status(400).send({ status: false, message: "title already exist" })

        if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please use correct excerpt" })

        if (!Validation(userId)) return res.status(400).send({ status: false, message: "please use userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })


        let checkIsbn = await bookModel.findOne({ISBN})
        if (checkIsbn) return res.status(409).send({ status: false, message: "ISBN already exist" })
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


const getBooksByQuery = async function(req , res)
{
    try{
        let data = req.query
    let {userId, category, subcategory} = data

        if(Object.keys(data).length==0)
        {
            let allBooks = await bookModel.find({isDeleted:false})
            return res.status(200).send({status:true, message:"all books", data : allBooks})
        }
    
    let filter= {}

    if(!userId==userId || userId=="" ) return res.status(400).send({status:false, message:"use correct userId"})
    if(userId)
    {
        if(!isValidObjectId(userId)) return res.status(400).send({status:false, message:"Please enter valid userId"})
        filter.userId=userId

        
    }
    
    if(!category==category || category=="" ) return res.status(400).send({status:false, message:"use correct category"})
    if(category)
    {
        if(!checkstring(category)) return res.status(400).send({status:false, message:"The category can contain only alphabets"})
        filter.category=category
    } 

    if(!subcategory==subcategory || subcategory=="" ) return res.status(400).send({status:false, message:"use correct subcategory"})
    if(subcategory)
    {
        if(!checkstring(subcategory)) return res.status(400).send({status:false, message:"The subcategory can contain only aplhabets"})
        filter.subcategory=subcategory
    }

      filter.isDeleted=false
    
    if(userId || category || subcategory) {
     let books = await bookModel.find(filter).select({_id:1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1, isDeleted:1})
    return res.status(200).send({status:true, message:"All books", count:books.length, data:books})
    }
    else{
        return res.status(400).send({status:false, message: "The filter can be only userId, category or subcategory"})
    }
}

    catch(err){
        return res.status(500).send({status:false, Error: err.message})
    }
}

//===================================== Get Books By Path Params=========================== //

const getBooksPath = async function(req,res){
    try {
        let data = req.params.bookId
        let books = await bookModel.findOne({_id:data})
        return res.status(200).send({status:true, data:books})
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}


//====================================== Delete Books By path params ========================//

const deleteBooks = async function(req,res){
    let data = req.params.bookId;
    if(data){
        if(!isValidObjectId(data)) return res.status(400).send({status:false, message: "please use valid bookId"})
    }

    let checkByBookId = await bookModel.findOne({_id:data, isDeleted:false})
    if(!checkByBookId) return res.status(404).send({status:false, message: "Book not found or already deleted"})

    if (checkByBookId.isDeleted == false) {
        let deletes = await bookModel.findOneAndUpdate({ _id: data }, {
            $set: { isDeleted: true },
            deletedAt: Date.now()
        }, { new: true })
        return res.status(200).send({status:true,message:deletes })
    }
}

    //let delete = await bookModel.findOneAndUpdate({_id:data, isDeleted:false},{$set:{isDeleted:true, deletedAt:Date.now()}, {new:true})

// DELETE /books/:bookId
// Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
// If the book document doesn't exist then return an HTTP status of 404 with a body like this
// Review APIs


module.exports = { createBooks, getBooksByQuery, getBooksPath, deleteBooks }
