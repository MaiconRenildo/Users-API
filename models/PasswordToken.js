const knex=require("../database/connection")
const User=require("./User")

class PasswordToken{

  async create(email){
    let user=await User.findByEmail(email);
    if(user!=undefined){

      try{
        let token=Date.now()
        await knex.insert({
          user_id:user.id,
          used:0,
          token:token
        }).table("passwordtokens");
        return {status:true,token:token}
  
      }catch(err){
        return {status:false,err:err}
      }
      
    }else{
      return {status:false,err:"O e-mail informado não existe no banco."}
    }
  }

  async validate(token){
    try{
      let result=await knex.select().where({token:token}).table("passwordtokens");
      if(result.length>0){
        let tk=result[0];
        if(tk.used){
          return false;
        }else{
          return true;
        }
      }else{
        return false;
      }
    }catch(err){
      return false;
    }
  }

}

module.exports=new PasswordToken();