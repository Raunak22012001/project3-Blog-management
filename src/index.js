const express = require('express')
const bodyParser = require('body-parser')
const mongoose  = require('mongoose')
const Router = require('../routes/route')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded()({extended:true}));


mongoose.connect("mongodb+srv://mohdfayeem321:KsdXTXld88GQq4da@cluster0.8eqarb6.mongodb.net/group22Database",{
useNewUrlParser: true})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', Router);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});






