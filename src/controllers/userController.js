const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const checkName = /^[a-z\s]+$/i
const phoneNub = /[6 7 8 9][0-9]{9}/
const emailMatch = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
const matchPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const createUser = async function(req,res){
    try {
    
    let data = req.body;
    let {title, name, phone, email, password, address} = data;

    if(Object.keys(data).length<6) return res.status(400).send({status:false, message:"please use mandatory data to create user"})

    if(!title==title || title=="") return res.status(400).send({status:false, message:"please use title"})

    if(!title=="Mr" && !title=="Mrs" && !title=="Miss") return res.status(400).send({status:false, message:"please use correct title"})
    
    if(!name==name || name=="") return res.status(400).send({status:false, message:"please use correct name"})
    if(!checkName.test(name)) return res.status(400).send({status:false,message:"don't use special char or number"})
    
    if(!phone==phone || phone=="") return res.status(400).send({status:false, message:"please use correct phone"})
    if(!phoneNub.test(phone)) return res.status(400).send({status:false,message:"don't use character"})
    if(phone.length<10 || phone.length>10) return res.status(400).send({status:false, message:"use correct phone number"})
    
    if(!email==email || email=="") return res.status(400).send({status:false, message:"please use correct email"})
    if(!emailMatch.test(email)) return res.status(400).send({status:false,message:"please use valid email "})
    
    if(!password==password || password=="") return res.status(400).send({status:false, message:"please use correct password"})
    if(!matchPass.test(password)) return res.status(400).send({status:false,message:"please use valid password "})
    if(password.length<8 || password.length>15) return res.status(400).send({status:false, message:"please use correct & valid password"})

    let checkUserByemail = await userModel.findOne({email:email, password:password})
    if(checkUserByemail) return res.status(400).send({status:false, message:"this user already exist"})

    let checkUserByphone = await userModel.findOne({phone:phone})
    if(checkUserByphone) return res.status(400).send({status:false, mssage:"thie phone number already exist"})
    
    if(!address==address || address=="") return res.status(400).send({status:false, message:"please use correct address"})

    let createuser = await userModel.create(data)
    return res.status(201).send({status:true, data:createuser})
} catch (error) {
    return res.status(500).send({status:false, message:error.message})
        
} 

}


const userlogin = async function(req, res)
{
    try {
        let userName = req.body.email;
      let password = req.body.password;
      if(!userName) return res.status(400).send({status: false, message: "Please enter userName"})
      if(!password) return res.status(400).send({status: false, message: "Please enter password"})

      let checkuser = await userModel.findOne({email: userName, password: password} )
      if(!checkuser) return res.status(404).send({status: false, message: "Invalid userName or password"})


      const token = await jwt.sign({
        userId : checkuser._id.toString(),
        iat: Math.floor(Date.now()/1000), 
        exp: Math.floor(Date.now()/1000)
      }, "Scretekeygroup22"
      )
      res.setHeader("x-auth-key", token);
    return res.status(201).send({status: true, message: "login successfully", data: token });

    }
    catch(err) {
        return res.status(500).send({status: false, msg: "Error", error: err.message })

    }
}


module.exports.userlogin=userlogin


module.exports.createUser=createUser;

// User APIs
// POST /register
// Create a user - atleast 5 users
// Create a user document from request body.
// Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like this
// Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like this

// users
// {
//   _id: ObjectId("88abc190ef0288abc190ef02"),
//   title: "Mr",
//   name: "John Doe",
//   phone: 9897969594,
//   email: "johndoe@mailinator.com", 
//   password: "abcd1234567",
//   address: {
//     street: "110, Ridhi Sidhi Tower",
//     city: "Jaipur",
//     pincode: "400001"
//   },
//   "createdAt": "2021-09-17T04:25:07.803Z",
//   "updatedAt": "2021-09-17T04:25:07.803Z",
// }
