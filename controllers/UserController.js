var User=require("../models/User");

class UserController{

  //Rota de criação de usuários
  async create(req,res){
    console.log(req.body);

    var {email,name,password,role}=req.body;
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

    var busca=await User.findEmail(email);
    if(busca){
      res.status(406);
      res.json({err:"Já existe um usuário cadastrado com esse e-mail"})
      return;
    }
        
    await User.new(email,password,name,role)
    res.status(200);
    res.send('OK!');
  }

  //Rota de busca de usuários de todos os usuários
  async find(req,res){
    var users=await User.findAll();
    res.json(users);
  }

  //Rota de busca de usuários por id
  async findUser(req,res){
    var id=req.params.id;
    var user=await User.findById(id);
    if(user==undefined){
      res.status(404);
      res.json({})
    }else{
      res.status(200);
      res.json(user);
    }
  }


}

module.exports=new UserController();