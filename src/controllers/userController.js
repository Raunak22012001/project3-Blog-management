const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


//============================== validations ====================================//

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isVAlidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
}

const checkName = function (value) {
    let regex = /^[a-z\s]+$/i
    return regex.test(value)
}
const phoneNub = function (value) {
     let regex =/[6 7 8 9][0-9]{9}/
    return regex.test(value)
}
const emailMatch = function (value) {
    let regex = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
    return regex.test(value)
}
const matchPass = function (value) {
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    return regex.test(value)
}
//======================================= Create user ===================================/


const createUser = async function(req,res)
{
    try {
    
    let data = req.body;
    let {title, name, phone, email, password, address} = data;

    if(!isVAlidRequestBody(data) ) return res.status(400).send({status:false, message:"please enter user details"})

    if(!isValid(title) ) return res.status(400).send({status:false, message:"Please enter title"})
    if((title!=="Mr") && (!title=="Mrs") && (!title=="Miss")) return res.status(400).send({status:false, message:"title must be Mr, Mrs or Miss"})
    
    
    if(!isValid(name) ) return res.status(400).send({status:false, message:"Please enter name"})
    if(!checkName(name)) return res.status(400).send({status:false,message:"Please enter valid name"})
    //Db calling
    let duplicateName = await userModel.findOne({name:name})
    if(duplicateName) return res.status(409).send({status:false, mssage:"name already exist"})
    

    if(!isValid(phone) ) return res.status(400).send({status:false, message:"Please enter phone"})
    if(!phoneNub(phone)) return res.status(400).send({status:false,message:"Phone number is invalid"})
     //Db calling
    let checkUserByphone = await userModel.findOne({phone:phone})
    if(checkUserByphone) return res.status(409).send({status:false, mssage:"phone already exist"})
    

    
    if(!isValid(email) ) return res.status(400).send({status:false, message:"Please enter email"})
    if(!emailMatch(email)) return res.status(400).send({status:false,message:"please enter valid email "})
    //Db calling
    let checkUserByemail = await userModel.findOne({email:email})
    if(checkUserByemail) return res.status(409).send({status:false, message:"email already exist"})
    
    
    if(!isValid(password) ) return res.status(400).send({status:false, message:"Please enter password"})
    if(!matchPass(password)) return res.status(400).send({status:false,message:"Please enter valid password "})
        //Db calling
    let checkUserBypassword = await userModel.findOne({password:password})
    if(checkUserBypassword) return res.status(409).send({status:false, message:"password already exist"})


    if(!isValid(address) ) return res.status(400).send({status:false, message:"Please enter address"})


    let createuser = await userModel.create(data)
     return res.status(201).send({status:true,message:"User created successfull", data:createuser})
} 
catch (error) {
    return res.status(500).send({status:false, message:error.message})
        
} 

}

//========================================== User login =====================================//

const userlogin = async function(req, res)
{
    try {
    let userName = req.body.email;
    let password = req.body.password;


    if(!isValid(userName) ) return res.status(400).send({status:false, message:"please use username"})
    if(!emailMatch(userName)) return res.status(400).send({status:false,message:"please use valid email "})
 
    if(!isValid(password) ) return res.status(400).send({status:false, message:"please use password"})
    if(!matchPass(password)) return res.status(400).send({status:false,message:"please use valid password "})



    let chekUser = await userModel.findOne({email:userName, password:password})
    if(!(chekUser)) return res.status(400).send({status:false, message:"Invalid email or password"})


    const token = await jwt.sign({
        userId : chekUser._id.toString(),
        iat: Math.floor(Date.now()/1000), //  create 
        exp: Math.floor(Date.now()/1000)   // expire
      }, "Scretekeygroup22"
      )
      res.setHeader("x-auth-key", token);
    return res.status(201).send({status: true, message: "login successfully", data: token, iat: Math.floor(Date.now()/1000), //  create 
    exp: Math.floor(Date.now()/1000) });

    }
    catch(err) {
        return res.status(500).send({status: false, msg: "Error", error: err.message })

    }
}


module.exports = {userlogin,createUser,isValid}

