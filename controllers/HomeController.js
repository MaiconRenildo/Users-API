class HomeController{

    async validate(req,res){
      res.status(200)
      res.send('okay')
    }
}

module.exports = new HomeController();