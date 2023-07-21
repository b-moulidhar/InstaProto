import axios from "axios";
import { useEffect, useState } from "react";


// function Login({ history }){
function Login(){
const [credentials, setCredentials] = useState({email:'', pswd:''});
    const refresh = function(){
        axios.get("http://localhost:5000/login")
        .then((res)=>{
            console.log(res.data)
        })
    }

    useEffect(()=>{
        refresh()
    },[])

    function changeHandler(evt){
        setCredentials({...credentials,[evt.target.id]:evt.target.value})
    }
    function login(){
        axios.post("http://localhost:5000/login",credentials)
        .then((res)=>{
            alert(res.data.message)
            if(res.status==200){
                window.location.href ="/uploadImage"
            // history.push("/uploadImage");
            }
        })
        .catch((err)=>{
            alert(err)
        })
    }

    return(
        <>
        <section className="vh-100" style={{backgroundColor: '#9A616D'}}>
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
                <div className="card" style={{borderRadius: '1rem'}}>
                <div className="row g-0">
                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp" alt="login form" className="img-fluid" style={{borderRadius: '1rem 0 0 1rem'}} />
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                        <form>
                        <div className="d-flex align-items-center mb-3 pb-1">
                            <i className="fas fa-cubes fa-2x me-3" style={{color: '#ff6219'}} />
                            <span className="h1 fw-bold mb-0">Logo</span>
                        </div>
                        <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: 1}}>Sign into your account</h5>
                        <div className="form-outline mb-4">
                            <input type="email" id="email" className="form-control form-control-lg" onInput={(evt)=>{changeHandler(evt)}} />
                            <label className="form-label" htmlFor="email">Email address</label>
                        </div>
                        <div className="form-outline mb-4">
                            <input type="password" id="pswd" className="form-control form-control-lg" onInput={(evt)=>{changeHandler(evt)}} />
                            <label className="form-label" htmlFor="pswd">Password</label>
                        </div>
                        <div className="pt-1 mb-4">
                            <button className="btn btn-dark btn-lg btn-block" type="button" onClick={login}>Login</button>
                        </div>
                        <a className="small text-muted" href="#!">Forgot password?</a>
                        <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <a href="register" style={{color: '#393f81'}}>Register here</a></p>
                        <a href="#!" className="small text-muted">Terms of use.</a>
                        <a href="#!" className="small text-muted">Privacy policy</a>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>

        </>
    )
}

export default Login;