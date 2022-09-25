const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')


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
     let regex =/^[6789][0-9]{9}$/
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

const isvalidPincode = function (pincode) {
    if (/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)) return true
    return false
  };


//======================================= Create user ===================================/


const createUser = async function(req,res)
{
    try {
    
    let data = req.body;
    let {title, name, phone, email, password, address} = data;

    if(!isVAlidRequestBody(data) ) return res.status(400).send({status:false, message:"please enter user details"})

    if(!isValid(title) ) return res.status(400).send({status:false, message:"Please enter title"})
    if((title!=="Mr") && (title!=="Mrs") && (title!=="Miss")) return res.status(400).send({status:false, message:"title must be Mr, Mrs or Miss"})
    
    
    if(!isValid(name) ) return res.status(400).send({status:false, message:"Please enter name"})
    if(!checkName(name)) return res.status(400).send({status:false,message:"Please enter valid name"})
    
    

    if(!isValid(phone) ) return res.status(400).send({status:false, message:"Please enter phone"})
    if(!phoneNub(phone)) return res.status(400).send({status:false,message:"Phone number is invalid"})
    

    
    if(!isValid(email) ) return res.status(400).send({status:false, message:"Please enter email"})
    if(!emailMatch(email)) return res.status(400).send({status:false,message:"please enter valid email"})

    let checkExistUser = await userModel.findOne({$or:[{phone:phone},{email:email}]})
    if(checkExistUser){
        if(checkExistUser.phone==phone) return res.status(409).send({status:false, mssage:"phone already exist"})
        if(checkExistUser.email==email) return res.status(409).send({status:false, mssage:"emailId already exist"})
    } 
   
    
    if(!isValid(password) ) return res.status(400).send({status:false, message:"Please enter password"})
    if(!matchPass(password)) return res.status(400).send({status:false,message:"Please enter valid password "})
        
    if(!isValid(address) ) return res.status(400).send({status:false, message:"Please enter address"})
  // validation for addresss address must nr in obj form
    if (address && typeof address !=="object") {
        return res.status(400).send({ status: false, message: "Address is in wrong format" })
    };
///// validation for pin code 
    if (address && address.pincode && !isvalidPincode(address.pincode)) {
        return res.status(400).send({ status: false, message: "Pincode is in wrong format" })
    }
   if(!isValid(address) ) return res.status(400).send({status:false, message:"Please enter address"})


    let createuser = await userModel.create(data)
     return res.status(201).send({status:true,message:"User created successfull", data:createuser})
} 
catch (error) {
    return res.status(500).send({status:false, message:error.message})
        
} 

}

// ========================================== User login ===================================== //

const userlogin = async function(req, res)
{
    try {
    let userName = req.body.email;
    let password = req.body.password;


    if(!isValid(userName) ) return res.status(400).send({status:false, message:"please use username"})
    if(!emailMatch(userName)) return res.status(400).send({status:false,message:"please use valid email"})
 
    if(!isValid(password) ) return res.status(400).send({status:false, message:"please use password"})
    if(!matchPass(password)) return res.status(400).send({status:false,message:"please use special character to make strong password "})



    let chekUser = await userModel.findOne({email:userName, password:password})
    if(!(chekUser)) return res.status(401).send({status:false, message:"invalid  email or password"})


    const token = await jwt.sign({
        userId : chekUser._id.toString(),
        iat: Math.floor(Date.now()/1000), 
        exp:  Math.floor(moment().add(1, 'days'))
      }, "Scretekeygroup22"
      )
      res.setHeader("x-api-key", token);
    return res.status(201).send({status: true, message: "login successfully", data: token, iat: Math.floor(Date.now()/1000), //  create 
     exp: Math.floor(moment().add(1, 'days'))
 });

    }
    catch(err) {
        return res.status(500).send({status: false, msg: "Error", error: err.message })

    }
}

module.exports = {userlogin,createUser,isValid}

