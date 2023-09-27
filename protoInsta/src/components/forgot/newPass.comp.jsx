import { useState } from "react";
import Swal from "sweetalert2";
import "./newpass.css";
import Api from "../../api/api";

function NewPass(){
    const [pass, setPass] = useState({nPass:"",cPass:""})
    const isValid = localStorage.getItem("validotp")
	const email = localStorage.getItem("email")
	const phno = localStorage.getItem("phno")
	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

	let contactDet;
	if(email){
		contactDet = email;
	}else if(phno){
		contactDet = phno;
	}
    const inputHandler = function (evt) {
		let x = document.getElementById("pswdError")
		let y = document.getElementsByClassName("pswdChangeBtn")[0]
		console.log(x)
       if(passwordRegex.test(evt.target.value)){
		   	x.style.display = "none"
		   	y.disabled = false;
		}else{
			y.disabled = true;
			x.style.display = "block"
	   }
        setPass({ ...pass, [evt.target.name]: evt.target.value });
      };
    
      function updatePass() {

        if(pass.nPass===pass.cPass && isValid){
			if(contactDet){
				Api.post("/updatepass", {npass: pass.nPass, contact:contactDet}) // Pass the phone number as an object in the request body
				.then((res) => {
				  if(res.status ==200){
					Swal.fire({
						position: 'top',
						icon: 'success',
						text: "Password changed successfully",
						background:"#edf2f4",
						showConfirmButton: false,
						timer: 1500
					  }).then(()=>{
						  localStorage.clear();
						  window.location.href = "/"
					  })
				  }else if(res.status ==500){
					  console.log("phone number or email not found")
				  }
				})
				.catch((err) => {
				  console.log(err);
				});
			}
           
        }
		else{
			if(isValid){
				Swal.fire({
					position: 'top',
					icon: 'error',
					text: 'passwords does not match',
					background:"#edf2f4",
				})
			}else if(!isValid){
				Swal.fire({
					position: 'top',
					icon: 'error',
					text: 'otp not validated',
					background:"#edf2f4",
				  })
			}
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
											<button class="btn btn-lg btn-primary pswdChangeBtn" onClick={updatePass}>Reset password</button>&nbsp; &nbsp;
											<a href="/" class="btn btn-lg btn-primary">Back to Login</a>
										</div>
									
								</div>
							<p id="pswdError" style={{display:"none"}}>* must have atleast 8 characters <br />
                               must have atleast 1 numberic character <br />
                               must have atleast 1 special characters</p>
							</div>

						</div>

					</div>
				</div>
			</div>
		</div>
    )
}
export default NewPass;