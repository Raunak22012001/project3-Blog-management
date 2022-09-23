const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')

// ---------------------------------validations---------------------------------------


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

// ---------------------------------------athentication------------------------------------

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        
        //if (!(token)) { token = req.headers["x-api-key"] }

        if (!(token)) return res.status(401).send({ status: false, message: "Please enter token" })

        let decodedtoken = jwt.verify(token, 'Scretekeygroup22')

        if (!decodedtoken) return res.status(401).send({ status: false, message: "Invalid token" })

        req.decodedToken = decodedtoken
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "Error", error: err.message })

    }
}


const authorisation = async function (req, res, next) {
    try {
        let decoded = req.decodedToken
        decodeduserid = decoded.userId

        if (req.params.bookId) {
            let bookId = req.params.bookId

            if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId" })

            let getuserid = await bookModel.findById(bookId).select({ userId: 1, _id: 0 })
            if (!getuserid) return res.status(400).send({ status: false, message: "wrong path params bookId" })

            let getuserId = getuserid.userId.toString()

            if (decodeduserid !== getuserId)
                return res.status(403).send({ status: false, message: "You are not authorised by bookId" })
            next()
        }

        else {
            let userId = req.body.userId
            if (decodeduserid !== userId)
                return res.status(403).send({ status: false, message: "forbidden due to userId" })
            next()
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "Error", error: err.message })

    }
}

module.exports = { authentication, authorisation }
