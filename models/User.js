var knex=require("../database/connection")
var bcrypt=require("bcrypt")

class User{
  
  async new(email,password,name,role){
    try{
      var hash=await bcrypt.hash(password,5)
      await knex.insert({email,password:hash,name,role}).table("users")
    }catch(err){
      console.log(err)
    }
  }

  async findEmail(email){
    try{
      var result=await knex.select("*").from("users").where({email:email});
      if(result.length>0){
        return true;
      }else{
        return false;
      }
    }catch(err){
      console.log(err);
      return false;
    }
  }

}

module.exports=new User();