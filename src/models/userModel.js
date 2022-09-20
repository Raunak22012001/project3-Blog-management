const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
         unique: true, 
         enum:["Mr", "Mrs", "Miss"]
        },
  name: {
    type: String,
    unique: true
},
  phone: {
    type: String,
    unique: true
},
  email: {
    type: String,
    unique: true
}, 
  password: {
    type: String,
    unique: true
},
  address: {
    street: {type:String},
    city: {type:String},
    pincode: {type:String}
  }},

 {timestamps:true}
)


module.exports = mongoose.model('User', userSchema)





