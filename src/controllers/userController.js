const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


//----------------------------validations-------------------------------------
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
     let regex =/[6 7 8 9][0-9]{9}/                //const mobileRegex = /^[0-9]{10}$/
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


const createUser = async function(req,res){
    try {
    
    let data = req.body;
    let {title, name, phone, email, password, address} = data;

    if(Object.keys(data).length<6) return res.status(400).send({status:false, message:"please use mandatory data to create user"})

    if(!title==title || title=="") return res.status(400).send({status:false, message:"please use title"})

    if (title!=="Mr" && title!=="Mrs" && title!=="Miss") return res.status(400).send({status:false, message:"please use title correctly"})
    
     if(!isVAlidRequestBody(data) ) return res.status(400).send({status:false, message:"please enter user details"})


    if(!isValid(title) ) return res.status(400).send({status:false, message:"please use title"})
    if((title!=="Mr") && (!title=="Mrs") && (!title=="Miss")) return res.status(400).send({status:false, message:"please use correct title"})
    
    
    if(!isValid(name) ) return res.status(400).send({status:false, message:"please use name"})
    if(!checkName(name)) return res.status(400).send({status:false,message:"don't use special char or number"})
    

    if(!isValid(phone) ) return res.status(400).send({status:false, message:"please use title"})
    if(!phoneNub(phone)) return res.status(400).send({status:false,message:"Phone number is invalid"})
     //Db calling
    let checkUserByphone = await userModel.findOne({phone:phone})
    if(checkUserByphone) return res.status(400).send({status:false, mssage:"thie phone number already exist"})
    

    
    if(!isValid(email) ) return res.status(400).send({status:false, message:"please use title"})
    if(!emailMatch(email)) return res.status(400).send({status:false,message:"please use valid email "})
    //Db calling
    let checkUserByemail = await userModel.findOne({email:email})
    if(checkUserByemail) return res.status(400).send({status:false, message:"this email already exist"})
    
    
    if(!isValid(password) ) return res.status(400).send({status:false, message:"please use title"})
    if(!matchPass(password)) return res.status(400).send({status:false,message:"please use valid password "})
        //Db calling
    let checkUserBypassword = await userModel.findOne({password:password})
    if(checkUserBypassword) return res.status(400).send({status:false, message:"this user already exist"})


    if(!isValid(address) ) return res.status(400).send({status:false, message:"please use title"})


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
module.exports.createUser=createUser

