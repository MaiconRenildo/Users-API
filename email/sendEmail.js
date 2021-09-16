const nodemailer=require("nodemailer");
const login=require("./conta")

let transporter=nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:587,
  secure:false,
  auth:login
})

class Email{
  async send(name,to,token){
    try{
      let result= await transporter.sendMail({
        from:login.user,
        to:to,
        subject:"Recuperação de senha",
        html:`<h3>Olá,${name}!</h3><h4>Aqui está seu token: "${token}". Ele tem validade de trinta minutos.</h4> `,
      })
      console.log(result)
    }catch(err){
      console.log(err);
    }
  }
}

module.exports=new Email();