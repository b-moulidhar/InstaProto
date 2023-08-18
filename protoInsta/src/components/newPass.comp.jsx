import { useState } from "react";
import axios from "axios";

function NewPass(){
    const [pass, setPass] = useState({nPass:"",cPass:""})
    const isValid = localStorage.getItem("validotp")
    const phno = localStorage.getItem("phno")
    const inputHandler = function (evt) {
        // const { name, value } = evt.target;
        setPass({ ...pass, [evt.target.name]: evt.target.value });
      };
    
      function updatePass() {

        
        console.log(pass);
        if(pass.nPass===pass.cPass && isValid){

            axios
              .post("http://localhost:5000/updatepass", {npass: pass.nPass, phno:phno}) // Pass the phone number as an object in the request body
              .then((res) => {
                if(res.status ==200){
                    localStorage.clear()
                    console.log(res.data);
                }else if(res.status ==500){
					console.log("phone number not found")
				}
              })
              .catch((err) => {
                console.log(err);
              });
        }else{

        }
      }
    

    return(
        <div class="container h-100">
    		<div class="row h-100">
				<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
					<div class="d-table-cell align-middle">

						<div class="text-center mt-4">
							<h1 class="h2">Reset password</h1>
							<p class="lead">
								Enter your phone Number to reset your password.
							</p>
						</div>

						<div class="card">
							<div class="card-body">
								<div class="m-sm-4">
									
										<div >
											<label>new password</label>
											<input class="form-control form-control-lg" type="password" name="nPass" placeholder="Enter your new password" onChange={(evt)=>inputHandler(evt)}/>
											<label>Confirm password</label>
											<input class="form-control form-control-lg" type="text" name="cPass" placeholder="Confirm your new password" onChange={(evt)=>inputHandler(evt)}/>
										</div>
										<div class="text-center mt-3">
											<button class="btn btn-lg btn-primary" onClick={updatePass}>Reset password</button>&nbsp; &nbsp;
											<a href="/" class="btn btn-lg btn-primary">Back to Login</a>
										</div>
									
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
    )
}
export default NewPass;