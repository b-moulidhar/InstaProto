import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearStore, setMobile } from "../redux/actions/actions";

function ForgetPass(){
    localStorage.clear();
    let dispatch = useDispatch();
    const token = useSelector(state=> state.authentication.token);
    const user_id = useSelector(state=> state.authentication.userId);
    const mobile = useSelector(state=> state.updation.phno);
    console.log(token,user_id)
    dispatch(clearStore());
    const [phno, setPhno] = useState("")
    const inputHandler = function (evt) {
        let ph = evt.target.value;
        setPhno(ph); // Update phno with the entered value
      };
      console.log(token,user_id)
    
      function sendPhone() {
        if (phno.length !== 10) {
          // Add a check for the phone number length (assuming you're using 10-digit phone numbers)
          console.log("Invalid phone number");
          return;
        }
    
        // console.log(phno);
        localStorage.setItem("phno",phno)
        dispatch(setMobile(phno))
        axios
          .post("http://localhost:5000/generateOTP", { phoneNumber: phno }) // Pass the phone number as an object in the request body
          .then((res) => {
              
            if(res.status==200){
                window.location.href = "/forgot/otp"
            }
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
          console.log(mobile)
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
											<label>Phone</label>
											<input class="form-control form-control-lg" type="number" name="phNum" placeholder="Enter your mobile number" onChange={(evt)=>inputHandler(evt)}/>
										</div>
										<div class="text-center mt-3">
											<button class="btn btn-lg btn-primary" onClick={sendPhone}>Reset password</button>&nbsp; &nbsp;
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
export default ForgetPass;