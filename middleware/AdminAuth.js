const jwt=require("jsonwebtoken")
const secret="jhdsjadkahdjashdkjhanmmc23vnxmcv5448njds54ifeijfiesjkfsldfj"

module.exports=function(req,res,next){
  const authToken=req.headers['authorization']

  if(authToken!=undefined){
    const bearer=authToken.split(' ');
    const token=bearer[1];

    try{
      const decoded=jwt.verify(token,secret)

      if(decoded.role==1){
        console.log(decoded)
        next();
      }else{
        res.status(403);
        res.send("Você não tem permissão para isso")
        return;
      }
      
      
    }catch(err){
      res.status(403);
      res.send("Você não está autenticado")
      return;
    }

  }else{
    res.status(403);
    res.send("Você ão está autenticado")
    return;
  }
}