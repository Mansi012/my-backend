const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const createUser=async function(req,res){
  let data=req.body;
  let savedData=await userModel.create(data)
  res.send({msg:savedData})
}
 const loginUser = async function (req, res) {
   let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
     return res.send({status:false, msg: "username or the password is not corerct"});
     
  
  let token = jwt.sign(
    { userId: user._id.toString() 
    }, 
    "lithium-mansi"
  );
 
  res.setHeader("x-auth-token", token);
  res.send({ status: true, msg: token });
 }
  const getUserData = async function (req, res) {
     let token = req.headers["x-auth-token"];
  
    if (!token){ 
      return res.send({ status: false, msg: "token must be present" });
    }
  //console.log(token); 
    let decodedToken = jwt.verify(token, "lithium-mansi");
if(!decodedToken){
    return res.send({ status: false, msg: "token is invalid" });
}
  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
   if (!userDetails){
     return res.send({ status: false, msg: "No such user exists" });
   }
   res.send({ status: true, data: userDetails });
  }
//   // Note: Try to see what happens if we change the secret while decoding the token
const updateUser = async function (req, res) {
let userId = req.params.userId;
  let user = await userModel.findById(userId);
//   //Return an error if no user with the given id exists in the db
   if (!user) {
     return res.send("No such user exists");
   }
   let userData = req.body;
   let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData,{new:true});
  res.send({ status: updatedUser, data: updatedUser });
};

let deleteUser= async function(req,res){
  let userId=req.params.userId;
  let user = await userModel.findById(userId);
  if(!user){
    return res.send("No such user exists")
  }
  let userData= await userModel.findOneAndUpdate({_id:user},{$set:{isDeleted:true}},{new:true})
  res.send({status:true,msg:userData})

}

const postMessage=async function(req,res){
  let message=req.body.message
  let user= await userModel.findById(req.params.userId)
  if(!user){
    return res.send({status:false,msg:"no such user exist"})
  }
  let updatedPost=user.posts
  updatedPost.push(message)
let updateData =await userModel.findOneAndUpdate({_id:user._id},{posts:updatedPost},{new:true})
res.send({status:true,posts:updateData})
}

 module.exports.postMessage=postMessage 
  module.exports.createUser=createUser
  module.exports.loginUser=loginUser
  module.exports.updateUser=updateUser
  module.exports.getUserData=getUserData
 module.exports.deleteUser=deleteUser