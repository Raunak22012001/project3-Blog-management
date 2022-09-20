const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')




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