import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function OtpComp(){
    const [Otp, setOtp] = useState();
    const phno = localStorage.getItem("phno");
    const email = localStorage.getItem("email");
   function inputHandler(evt){
    let otp=evt.target.value 
    
        setOtp(otp);
    
   }
    function checkOtp(){
        axios.post("http://localhost:5000/verifyOTP",{Otp,phno,email})
        .then((res)=>{
            if(res.status===200){
                console.log(res.data)
				Swal.fire({
					position: 'top',
					icon: 'success',
					text: 'otp verified successfully',
					background:"#edf2f4",
					showConfirmButton: false,
					timer: 1000
				  }).then(()=>{
					  window.location = "/newpassword"
				  })
                localStorage.setItem("validotp",true);
            }else{
				console.log(res.data)
			}
        })
        .catch((err)=>{
            alert("invalid otp");
        })
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
									
										<div c>
											<label>otp</label>
											<input class="form-control form-control-lg" type="text" name="phNum" placeholder="Enter your Otp" onInput={(evt)=>inputHandler(evt)}/>
										</div>
										<div class="text-center mt-3">
											<button  class="btn btn-lg btn-primary" onClick={checkOtp}>submit</button>&nbsp; &nbsp;
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
export default OtpComp;