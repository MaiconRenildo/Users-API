const User=require("../models/User");
const PasswordToken=require("../models/PasswordToken")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const secret="jhdsjadkahdjashdkjhanmmc23vnxmcv5448njds54ifeijfiesjkfsldfj"

class UserController{

  //Rota de criação de usuários
  async create(req,res){
    console.log(req.body);

    let {email,name,password,role}=req.body;
    if(email==undefined || name==undefined || password==undefined || role==undefined ){
      res.status(400)
      res.json({err:'Algo não foi preenchido'});
      return; //Garante que o que estiver depois não será executado
    }

    if(email.trim()=='' || name.trim()=='' || password.trim()=='' || role.trim()==''){
      res.status(400)
      res.json({err:'Algo não foi preenchido'});
      return;
    }

    let busca=await User.findEmail(email);
    if(busca){
      res.status(406);
      res.json({err:"Já existe um usuário cadastrado com esse e-mail"})
      return;
    }
        
    await User.new(email,password,name,role)
    res.status(200);
    res.send('OK!');
  }

  //Rota de busca de todos os usuários
  async find(req,res){
    let users=await User.findAll();
    res.json(users);
  }

  //Rota de busca de usuários por id
  async findUser(req,res){
    let id=req.params.id;
    let user=await User.findById(id);
    if(user==undefined){
      res.status(404);
      res.json({})
    }else{
      res.status(200);
      res.json(user);
    }
  }

  //Rota de edição de usuários
  async edit(req,res){
    var {id,name,role,email}=req.body;
    let result=await User.update(id,email,name,role);

    if(result.status){
      res.status(200);
      res.send('Dados atualizados com sucesso');
    }else{
      res.status(400);
      res.json(result.err);
    }
  }

  //Rota de deleção de usuários
  async remove(req,res){
    let id=req.params.id;

    let result=await User.delete(id)
    if(result.status){
      res.status(200);
      res.send("Usuário deletado com sucesso")
    }else{
      res.status(406);
      res.json(result.err)
    }
  }

  //Rota de criação do token
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

  //Rota de alteração de senha
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

  async login(req,res){
    let {email,password}=req.body;

    let user=await User.findByEmail(email);

    if(user!=undefined){
      let result=await bcrypt.compare(password,user.password)

      if(result){
        let token=jwt.sign({email:user.email,role:user.role},secret);
        res.status(200);
        res.json({token:token})
      }else{
        res.status(406);
        res.send("Senha incorreta")
      }
    }else{
      res.json({status:false})
    }
  }

}

module.exports=new UserController();