const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};



const authentication = async function (req, res, next)
{
    try{
        let token = req.header["x-auth-key"]
    if(!(token)) {
        let token = req.header["x-auth-key"]
    }
    if(!(token)) return res.status(401).send({status:false, message:"Please enter token"})
    let decodedtoken = jwt.verify(token, 'Scretekeygroup22')
    if(!decodedtoken) return res.status(401).send({status:false, message: "Invalid token"})
    req.decodedToken = decodedtoken
    next()
}
catch(err) {
    return res.status(500).send({status: false, msg: "Error", error: err.message })

}
}


const authorisation = async function (req,res,next)
{
    try{
        let decoded = req.decodedToken
        let paramsbookId = req.params.bookId
        if (!isValidObjectId(paramsbookId)) {
            return res.status(400).send({ status: false, msg: "please enter valid blogId" })
        }
        let userLoggedIn = decoded.userId
        let book = await bookModel.findById(paramsbookId)
        if (!book) {
            return res.status(404).send({ status: false, msg: "Blog not Found" })
        }
        const bookUserId = (blog.userId).toString()
        if (bookUserId !== userLoggedIn) {
            return res.status(403).send({ status: false, msg: "You are not authorised Person" })
        }
        next()

    }
    catch(err) {
        return res.status(500).send({status: false, msg: "Error", error: err.message })

    }
}

module.exports = {authentication, authorisation}