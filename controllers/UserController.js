class UserController{
  //async index(res,res){}

  async create(req,res){
    console.log(req.body);

    var {email,name,password,role}=req.body;
    if(email==undefined || name==undefined || password==undefined || role==undefined ){
      //res.sendStatus(400);
      res.status(400)
      res.json({err:'Algo não foi preenchido'})
    }else{
      res.status(200);
      res.send('Tudo ok');
    }
    
  }
}

module.exports=new UserController();