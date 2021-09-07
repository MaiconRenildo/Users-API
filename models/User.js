const knex=require("../database/connection")
const bcrypt=require("bcrypt")
const PasswordToken = require("./PasswordToken")


class User{
  
  async new(email,password,name,role){
    try{
      let hash=await bcrypt.hash(password,5)
      await knex.insert({email,password:hash,name,role}).table("users")
    }catch(err){
      console.log(err)
    }
  }

  async findEmail(email){
    try{
      let result=await knex.select("*").from("users").where({email:email});
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

  async findAll(){
    try{
      let result=await knex.select(["id","name","email","role"]).table("users")
      return result;
    }catch(err){
      console.log(err)
      return [];
    }
  }

  async findById(id){
    try{
      let result=await knex.select(["id","name","email","role"]).where({id:id}).table("users")

      if(result.length>0){
        return result[0]
      }else{
        return undefined;
      }
      
    }catch(err){
      console.log(err)
      return undefined;
    }
  }

  async findByEmail(email){
    try{
      let result=await knex.select(["id","name","password","email","role"]).where({email:email}).table("users")

      if(result.length>0){
        return result[0]
      }else{
        return undefined;
      }
      
    }catch(err){
      console.log(err)
      return undefined;
    }
  }

  async update(id,email,name,role){

    if(id==undefined){
      return {status:false,err:"Id não informado"}
    }

    let user=await this.findById(id);
    if(user==undefined){
      return {status:false,err:"O usuário não existe"}
    }else{
      let editUser={}

      if(email!=undefined && email.trim()!=''){
        if(email!=user.email){
          let result=await this.findEmail(email);
          if(result==false){
            editUser.email=email
          }else{
            return {status:false,err:"Já existe um outro usuário cadastrado com esse e-mail"}
          }
        }else{
          return {status:false,err:"O e-mail é o mesmo cadastrado anteriormente"}
        }
      }

      if(name!=undefined && name.trim()!=''){
        editUser.name=name;
      }

      if(role!=undefined){
        editUser.role=role;
      }

      if(Object.keys(editUser).length==0){
        return {status:false,err:"O dados necessários não foram informados"}
      }else{
        try{
          await knex.update(editUser).where({id:id}).table("users")
          return {status:true}
        }catch(err){
          return {status:false,err:err}
        }
      }
  
    }
  }

  async delete(id){
    let user=await this.findById(id);
    if(user!=undefined){
      try{
        await knex.delete().where({id:id}).table("users")
        return {status:true}
      }catch(err){
        return {status:false,err:err}
      }
      
    }else{
      return {status:false,err:"O usuário informado não existe"}
    }
  }

  async changePassword(newPassword,id,token){
    let hash=await bcrypt.hash(newPassword,5);
    await knex.update({password:hash}).where({id:id}).table("users");
    await PasswordToken.setUsed(token);
  }

}

module.exports=new User();