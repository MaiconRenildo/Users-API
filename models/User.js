const knex=require("../database/connection")
const bcrypt=require("bcrypt")
const Validation=require("./Validation")


class User{
  
  async new(email,password,name,role){

    //Valida o Nome
    if(Validation.name(name)==false){
      return {status:false,statusCode:400,err:"Nome inválido"}
    }

    //Valida o E-mail
    if(Validation.email(email)==false){
      return {status:false,statusCode:400,err:"E-mail inválido"}
    }

    let busca=await this.findEmail(email);
    if(busca){
      return {status:false,statusCode:400,err:"Já existe um usuário cadastrado com esse e-mail"}
    }

    //Valida a senha
    if(Validation.password(password)==false){
      return {status:false,statusCode:400,err:"Senha inválida.Ela deve ter no mínimo 6 caracteres."}
    }

    role=0; //Por padrão o cargo é zero(usuário comum)
    
    try{
      let hash=await bcrypt.hash(password,5)
      await knex.insert({email,password:hash,name,role}).table("users")
      return {status:true,statusCode:201}
    }catch(err){
      return {status:false,statusCode:400,err:err}
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
      
      return false;
    }
  }

  async findAll(){
    try{
      let result=await knex.select(["id","name","email","role"]).table("users")
      if(result.length>0){
        return {status:true,statusCode:200,res:result}
      }else{
        return {status:false,statusCode:404,err:"Não há usuários a serem mostrados"}
      }
    }catch(err){
      return {status:false,statusCode:400,err:err}
    }
  }

  async findById(id){
    try{
      let result=await knex.select(["id","name","email","role"]).where({id:id}).table("users")
      if(result.length>0){
        return {status:true,statusCode:200,res:result[0]}
      }else{
        return {status:false,statusCode:404,err:"Usuário não encontrado"}
      }
    }catch(err){
      return {status:false,statusCode:404,err:err}
    }
  }

  async findByEmail(email){
    try{
      let result=await knex.select(["id","name","password","email","role"]).where({email:email}).table("users")
      if(result.length>0){
        return {status:true,statusCode:200,res:result[0]}
      }else{
        return {status:false,statusCode:404,err:"Usuário não encontrado"}
      }
    }catch(err){
      return {status:false,statusCode:404,err:err}
    }
  }
  
  async update(id,email,name,role){

    if(id==undefined){
      return {status:false,statusCode:400,err:"Id não informado"}
    }

    let user=await this.findById(id);
    if(user==undefined){
      return {status:false,statusCode:400,err:"O usuário não existe"}
    }else{
      let editUser={}

      //Verifica se o nome é válido
      if(Validation.name(name)==0){
        return {status:false,statusCode:400,err:"Nome inválido"}
      }
      editUser.name=name;

      //Verifica se o e-mail é válido
      if(Validation.email(email)==0){
        return {status:false,statusCode:400,err:"E-mail inválido"}
      }

      //Se o e-mail for diferente do atual, verifica se existe outro usuário cadastrado com o novo e-mail
      if(email!=user.email){
        let result=await this.findEmail(email);
        if(result==false){
          editUser.email=email
        }else{
          return {status:false,statusCode:400,err:"Já existe um outro usuário cadastrado com esse e-mail"}
        }
      }
      
      //Verifica se o cargo é válido
      if(Validation.role(role)==0){
        return {status:false,statusCode:400,err:"Cargo inválido. Ele só pode receber 0(usuário comum) ou 1(administrador)"}
      } 
      editUser.role=role;
      
      try{
        await knex.update(editUser).where({id:id}).table("users")
        return {status:true,statusCode:200}
      }catch(err){
        return {status:false,statusCode:400,err:err}
      }
      
    }
  }

  async delete(id){
    let user=await this.findById(id);
    if(user!=undefined){
      try{
        await knex.delete().where({id:id}).table("users")
        return {status:true,statusCode:200}
      }catch(err){
        return {status:false,statusCode:400,err:err}
      }
    }else{
      return {status:false,statusCode:404,err:"O usuário informado não existe"}
    }
  }
}

module.exports=new User();