import { useState } from "react";
import axios from "axios";

function OtpComp(){
    const [Otp, setOtp] = useState(Number)
    const phno = localStorage.getItem("phno")
   function inputHandler(evt){
    let otp=evt.target.value 
    if(Number(otp)!=NaN){
        setOtp(Number(otp));
    }
   }
    function checkOtp(){
        axios.post("http://localhost:5000/verifyOTP",{Otp,phno})
        .then((res)=>{
            if(res.status===200){
                console.log(res.data)
                localStorage.setItem("validotp",true);
                window.location = "/newpassword"
            }
        })
        .catch((err)=>{
            console.log(err)
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
											<input class="form-control form-control-lg" type="text" name="phNum" placeholder="Enter your mobile number" onInput={(evt)=>inputHandler(evt)}/>
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