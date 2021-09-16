const User=require("../models/User");
const PasswordToken=require("../models/PasswordToken")
//const Validation=require('../models/Validation')

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const secret="jhdsjadkahdjashdkjhanmmc23vnxmcv5448njds54ifeijfiesjkfsldfj"


class UserController{

  //Rota de criação de usuários 
  async create(req,res){
    let {email,name,password,role}=req.body;

    let result=await User.new(email,password,name,role)
    if(result.status){
      res.status(result.statusCode);
      res.send('Usuário cadastrado com sucesso');
    }else{
      res.status(result.statusCode);
      res.json(result.err)
    }
  }

  //Rota de busca de todos os usuários
  async find(req,res){
    let result=await User.findAll();
    if(result.status){
      res.status(result.statusCode)
      res.json(result.res);
    }else{
      res.status(result.statusCode)
      res.json(result.err);
    }
  }

  //Rota de busca de usuários por id 
  async findUser(req,res){
    let id=req.params.id;
    let result=await User.findById(id);
    if(result.status){
      res.status(result.statusCode);
      res.json(result.res);
    }else{
      res.status(result.statusCode);
      res.json(result.err)
    }
  }

  //Rota de edição de usuários
  async edit(req,res){
    var {id,name,role,email}=req.body;
    let result=await User.update(id,email,name,role);
    if(result.status){
      res.status(result.statusCode);
      res.send('Dados atualizados com sucesso');
    }else{
      res.status(result.statusCode);   
      res.json(result.err);
    }
  }

  //Rota de deleção de usuários 
  async remove(req,res){
    let id=req.params.id;
    let result=await User.delete(id)
    if(result.status){
      res.status(result.statusCode);
      res.send("Usuário deletado com sucesso")
    }else{
      res.status(result.statusCode);
      res.json(result.err)
    }
  }

  //Rota de Login
  async login(req,res){
    let {email,password}=req.body;
    let result=await User.findByEmail(email);
    if(result.status){
      let comparation=await bcrypt.compare(password,result.res.password)
      if(comparation){
        let token=jwt.sign({email:result.res.email,role:result.res.role},secret,{expiresIn:"24h"});
        res.status(result.statusCode);
        res.json({token:token})
      }else{
        res.status(401);
        res.json("Senha incorreta")
      }
    }else{
      res.status(404);
      res.json(result.err)
    }
  }

  //Rota de criação do token para recuperação de senha
  async recoverPassword(req,res){
    let email=req.body.email;
    let result=await PasswordToken.create(email)
    if(result.status){
      res.status(200);
      res.json({email:result.email})
    }else{
      res.status(406)
      res.send(result.err)
    }
  }

  //Rota de validação do token  para recuperação de senha
  async tokenValidate(req,res){
    let token=req.body.token;
    let validate=await PasswordToken.validate(token);
    if(validate.status){
      res.status(200);
      res.json({token:token,id:validate.id})
    }else{
      res.status(validate.statusCode);
      res.send(validate.err)
    }
  }

  //Rota de mudança de senha
  async changePass(req,res){
    let token=req.body.token
    let id=req.body.id;
    let newPassword=req.body.password
    let result=await PasswordToken.changePassword(newPassword,id,token);
    if(result.status){
      res.status(result.statusCode);
      res.json(result.res)
    }else{
      res.status(result.statusCode);
      res.json(result.err)
    }
  }
}

module.exports=new UserController();