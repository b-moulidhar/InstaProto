import axios from "axios";
import { useState } from "react";
import "./register.css"

function Register(){
const [confPswd, setConfPswd] = useState(false);
const [user,setUser] = useState({name :'', email:'', mobile:'', pswd:'' })
const [finalUser, setFinalUser] = useState();
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|in|edu|co)$/i;
const phnumPattern = /^[6-9]\d{9}$/;
let regButton = document.getElementsByClassName("btn-primary")[0];


function changeHandler(evt){
    setUser({...user, [evt.target.id]:evt.target.value})
}

function checkPswd(evt){
    if(user.pswd == evt.target.value){
      if(passwordRegex.test(user.pswd)){
        console.log("good password")
        setFinalUser(user);
        regButton.disabled = false;
      }else{
        let req = document.getElementsByClassName("pswdReq")[0];
        req.style.display = "block"
        regButton.disabled = true;
        console.log("password does not meet the requirement");
      }
        console.log("password match");
    }else{
      alert("Password Doesn't match");
    }
  }
   
function emailVerify(evt){
     let errorDisplay = document.getElementById("emailError");
      if(emailPattern.test(evt.target.value)){
        regButton.disabled = false;
        errorDisplay.style.display = "none"
      }else{
        errorDisplay.style.display = "block"
        regButton.disabled = true;
      }
   
}
function emailVerify(evt){
    
  let errorDisplay = document.getElementById("emailError");
      if(emailPattern.test(evt.target.value)){
        regButton.disabled = false;
        errorDisplay.style.display = "none"
      }else{
        errorDisplay.style.display = "block"
        regButton.disabled = true;
      }
   
}
function phnumVerify(evt){
    
  let errorDisplay = document.getElementById("phoneError");
      if(phnumPattern.test(evt.target.value)){
        regButton.disabled = false;
        errorDisplay.style.display = "none"
      }else{
        errorDisplay.style.display = "block"
        regButton.disabled = true;
      }
   
}

function pswdVerify(evt){
  let req = document.getElementsByClassName("pswdReq")[0];
  if(passwordRegex.test(evt.target.value)){
    console.log("good password")
    regButton.disabled = false;
    req.style.display = "none"
  }else{
    req.style.display = "block"
    regButton.disabled = true;
  }
}

function register(){
  
    // console.log(finalUser,user)
    if(finalUser.name!=''){
        axios.post("http://localhost:5000/register",finalUser)
        .then((res)=>{
          localStorage.setItem("user",finalUser);
            console.log(res)
            if(res.status==201){
                alert("Resgistered successfully");
                window.location.href = "/"
                // window.location.href = "/";
            }else if(res.status == 500){
                alert("email already exits");
            }
            else{
                alert("there was some error or please check the formats of data entered");
            }
        })
        .catch((err)=>{
            console.log("Error ",err)
            alert(err)
        })
    }else{
      alert("Password does not match");
    }
}
    return (
      <>
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div className="card text-black" style={{ borderRadius: 25 }}>
                  <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                      <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                          Sign up
                        </p>
                        <form className="mx-1 mx-md-4">
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-user fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="text"
                                id="name"
                                className="form-control"
                                onInput={(evt)=>{changeHandler(evt)}}
                              />
                              <label
                                className="form-label"
                                htmlFor="name"
                              >
                                Your Name
                              </label>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="email"
                                id="email"
                                className="form-control"
                                onInput={(evt)=>{changeHandler(evt)}}
                                onBlur={(evt)=>{emailVerify(evt)}}
                              />
                              <label
                                className="form-label"
                                htmlFor="email"
                              >
                                Your Email
                              </label>
                              <p id="emailError" style={{display:"none",color:"red"}}>*not a valid email</p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="number"
                                id="mobile"
                                className="form-control"
                                onInput={(evt)=>{changeHandler(evt)}}
                                onChange={(evt)=>{phnumVerify(evt)}}
                              />
                              <label
                                className="form-label"
                                htmlFor="mobile"
                              >
                                Your phone number
                              </label>
                              <p id="phoneError" style={{display:"none",color:"red"}}>*not a valid phone number</p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-lock fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="password"
                                id="pswd"
                                className="form-control"
                                onInput={(evt)=>{changeHandler(evt)}}
                                onChange={(evt)=>{pswdVerify(evt)}}
                              />
                              <label
                                className="form-label"
                                htmlFor="pswd"
                              >
                                Password
                              </label>
                              <p className="pswdReq" style={{display:"none"}}>
                              <p>* must have atleast 8 characters <br />
                               must have atleast 1 numberic character <br />
                               must have atleast 1 special characters</p>

                              </p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-key fa-lg me-3 fa-fw" />
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="password"
                                id="confPswd"
                                className="form-control"
                                onBlur={(evt)=>{checkPswd(evt)}}
                              />
                              <label
                                className="form-label"
                                htmlFor="confPswd"
                               
                              >
                                Repeat your password
                              </label>
                            </div>
                          </div>
                          <div className="justify-content-center mx-4 mb-3 mb-lg-4">
                            <button
                              type="button"
                              className="btn btn-primary btn-lg"
                              onClick={register}
                            >
                              Register
                            </button>
                            &nbsp;
                            <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>already have an account? <a href="/" style={{color: '#393f81'}}>login</a></p>
                          </div>
                        </form>
                      </div>
                      <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                          className="img-fluid"
                          alt="Sample"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}

export default Register;