const express = require("express")
//const app = express();
const router = express.Router();
const UserController=require("../controllers/UserController");
const HomeController = require("../controllers/HomeController");
const AdminAuth=require("../middleware/AdminAuth")

router.post('/user',UserController.create)
router.get('/user',AdminAuth,UserController.find)
router.get('/user/:id',AdminAuth,UserController.findUser)
router.put('/user',AdminAuth,UserController.edit)
router.delete('/user/:id',AdminAuth,UserController.remove)
router.post("/login",UserController.login)

router.post("/recoverpassword",UserController.recoverPassword)
router.post("/tokenValidate",UserController.tokenValidate)

router.post('/validate',AdminAuth,HomeController.validate)

//router.get('/sla',UserController.sla)

module.exports = router;