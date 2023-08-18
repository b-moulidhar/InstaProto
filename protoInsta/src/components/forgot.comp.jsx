import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearStore, setMobile } from "../redux/actions/actions";

function ForgetPass(){
    localStorage.clear();
    let dispatch = useDispatch();
    // const token = useSelector(state=> state.authentication.token);
    // const user_id = useSelector(state=> state.authentication.userId);
    // const mobile = useSelector(state=> state.updation.phno);
   
    dispatch(clearStore());
    const [phno, setPhno] = useState("");

    const inputHandler = function (evt) {
      let ph = evt.target.value;
      setPhno(ph); // Update phno with the entered value
      
      };
      // console.log(token,user_id)
    
      async function sendPhone(e) {
        e.preventDefault()
        console.log(phno)
        localStorage.setItem("phno", phno);
        if (phno.length !== 10) {
          // Add a check for the phone number length (assuming you're using 10-digit phone numbers)
          console.log("Invalid phone number");
          return;
        }
          try {
            localStorage.setItem("phno", phno);
            const storedPhno = localStorage.getItem("phno");
            console.log("Stored phone number:", storedPhno);

            // console.log(phno);
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
          } catch (error) {
            console.log("Error while setting item in local storage:", error);
            return;
          }

            // console.log(mobile)
        
      }
    

    return(
        <div className="container h-100">
    		<div className="row h-100">
				<div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
					<div className="d-table-cell align-middle">

						<div className="text-center mt-4">
							<h1 className="h2">Reset password</h1>
							<p className="lead">
								Enter your phone Number to reset your password.
							</p>
						</div>

						<div className="card">
							<div className="card-body">
								<div className="m-sm-4">
									
										<div >
											<label>Phone</label>
											<input className="form-control form-control-lg" type="number" name="phNum" placeholder="Enter your mobile number" onBlur={(evt)=>inputHandler(evt)}/>
										</div>
										<div className="text-center mt-3">
											<button className="btn btn-lg btn-primary" onClick={(evt)=>sendPhone(evt)}>Reset password</button>&nbsp; &nbsp;
											<a href="/" className="btn btn-lg btn-primary">Back to Login</a>
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