class Validation{

  email(email){
    let emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailPattern.test(email); 
  }

  name(string){
    let name=string.trim();
    let regex=/[0-9]/
  
    if(name==undefined || name=='' || regex.test(name)){
      return false;
    }
  
    if(name.length==1 || name.length>60){
      return false;
    }
  
    return true
  }

  password(string){
    let password=string
    if(password==null || password.trim()==''){
      return false;
    }

    if(string.trim().length<6){
      return false;
    }
    return true;
  }

  role(value){
    if(value==undefined){
      return false;
    }
    if(value>1 || value<0){
      return false;
    }
    return true;
  }

  id(value){
    let a=isNaN(value);
    if(a){
      return false;
    }
    if(value<0){
      return false;
    }
    return true;
  }
}

module.exports=new Validation();