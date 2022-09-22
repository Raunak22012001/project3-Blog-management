const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
//const userModel = require('../models/userModel')
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};



const authentication = async function (req, res, next)
{
    try{
        let token = req.headers["x-Auth-key"]
    if(!(token)) {
         token = req.headers["x-auth-key"]
    }
    if(!(token)) return res.status(401).send({status:false, message:"Please enter token"})
    let decodedtoken = jwt.verify(token, 'Scretekeygroup22')
    //console.log(decodedtoken)
    if(!decodedtoken) return res.status(401).send({status:false, message: "Invalid token"})
    req.decodedToken = decodedtoken
    next()
}
catch(err) {
    return res.status(500).send({status: false, msg: "Error", error: err.message })

}
}
// create :- userId,     update:- bookId,     delete:- bookId


const authorisation = async function (req,res,next)
{
    try{
        let decoded = req.decodedToken
        decodeduserid = decoded.userId
       //console.log("decoded UserId is", decodeduserid)

    if(req.params.bookId)
      {
        let bookId = req.params.bookId
        //console.log("bookId is" ,bookId)
      if(!isValidObjectId(bookId)) return res.status(400).send({status:false, message:"Please enter valid bookId"})

      let getuserid = await bookModel.findById(bookId).select({userId:1, _id:0})
      if(!getuserid) return res.status(400).send({status:false, message:"wrong path params bookId"})
      
      let getuserId = getuserid.userId.toString()
      //console.log("UserId from bookmodel", getuserId)
    
    if(decodeduserid !== getuserId)
    return res.status(403).send({status:false, message:"You are not authorised by bookId"})
        next()
      }

     else {
        let userId = req.body.userId
      if(decodeduserid !== userId)
    return res.status(403).send({status:false, message:"forbidden due to userId"})
        next()
    }

    }
    catch(err) {
        return res.status(500).send({status: false, msg: "Error", error: err.message })

    }
}

module.exports = {authentication, authorisation}