const bookModel = require('../models/bookModel');

const userController = require('../controllers/usercontroller');

const Validation = userController.isValid;

const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};


//============================================= Create Books =============================== // 

const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;


        if (!Validation(title)) return res.status(400).send({ status: false, message: "use correct title which is mandatory " })
        let checkTitle = await bookModel.findOne({title})

        
        if (checkTitle) return res.status(400).send({ status: false, message: "title already exist" })

        if (!Validation(excerpt)) return res.status(400).send({ status: false, message: "please use correct excerpt" })

        if (!Validation(userId)) return res.status(400).send({ status: false, message: "please use userId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please use correct userId" })


        let checkIsbn = await bookModel.findOne({ISBN})
        if (checkIsbn) return res.status(400).send({ status: false, message: "ISBN already exist" })
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


//======================================= Get Books By Query Params ========================//

const getBooksByQuery = async function (req, res) {
    try {
        let data = req.query
        let { userId, category, subcategory } = data;
        
        
        if(data.title || data.excerpt || data.ISBN || data.reviews || data.releasedAt) return res.status(400).send({status:false, message:"don't use this type of queries except userId, category and subcategory to get books"})

        
        if(!userId==userId || userId=="" ) return res.status(400).send({status:false, message:"use correct userId"})
        if(userId.length<24 || userId.length>24) return res.status(400).send({status:false, message:"use correct userId"})

        if(!category==category || category=="" ) return res.status(400).send({status:false, message:"use correct category"})

        if(!subcategory==subcategory || subcategory=="" ) return res.status(400).send({status:false, message:"use correct subcategory"})


        let books = await bookModel.find(data,{isDeleted:false})
        

        res.status(200).send({ status: true, msg: "Book list", data: books });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
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


module.exports = { createBooks, getBooksByQuery, getBooksPath }
