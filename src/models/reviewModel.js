const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: ObjectId,
            required: true,
            refs: 'Book'
        },
        reviewedBy: {
            type: String,
            default: "Guest",
            required: true,
            trim: true,
            value: { type: String, trim: true }   // {value:{type:String}} 
        },

        reviewedAt: {
            type: Date,
            required: true
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            trim: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
)




module.exports = mongoose.model('Reviws', reviewSchema)
