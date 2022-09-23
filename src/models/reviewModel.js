const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

        bookId: {
            type: ObjectId,
            required: true,
            ref: "Book"
        },
        reviewedBy: {
            type: String,
            required: true,
            default: 'Guest',
            value: { type: String }
        },
        reviewedAt: {
            type: Date,
            required: true
        },
        rating: {
            type: Number,
            Min: 1,
            Max: 5,
            required: true
        },
        
        review:String,

        isDeleted: {
            type: Boolean,
            default: false
        }
    },  {timestamps:true});


module.exports = mongoose.model('Review', reviewSchema)



