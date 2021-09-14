const User=require("../models/User");
//const PasswordToken=require("../models/PasswordToken")
//const Validation=require('../models/Validation')

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const secret="jhdsjadkahdjashdkjhanmmc23vnxmcv5448njds54ifeijfiesjkfsldfj"


class UserController{


  ////////////////Usuário comum

  //Rota de criação de usuários OK
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

  //Rota de busca de todos os usuários OK
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

  //Rota de busca de usuários por id OK
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


  ////////////////Admin

  //Rota de edição de usuários  OK
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

  //Rota de deleção de usuários OK
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

  //Rota de Login OK
  async login(req,res){
    let {email,password}=req.body;

    let result=await User.findByEmail(email);

    if(result.status){
      let comparation=await bcrypt.compare(password,result.res.password)

      if(comparation){
        let token=jwt.sign({email:result.res.email,role:result.res.role},secret);
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

  



  ///////////////Recuperação de senha - Não finalizado
  //Rota de criação do token  NOT
  async recoverPassword(req,res){
    let email=req.body.email;

    let result=await PasswordToken.create(email)
    if(result.status){

      //Nodemailer.send()
      res.status(200);
      res.json(result.token)
    }else{
      res.status(406)
      res.send(""+result.err)
    }
  }

  //Rota de alteração de senha  NOT
  async changePassword(req,res){
    let token=req.body.token;
    let password=req.body.password;

    let validate=await PasswordToken.validate(token);

    if(validate.status){
      let userId=validate.token.user_id;

      let result=await User.changePassword(password,userId,token);
      res.status(200);
      res.send("Senha alterada com sucesso")

    }else{
      res.status(406);
      res.send("token invalido")
    }
  }
  
}

module.exports=new UserController();