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
    const [email, setEmail] = useState("");
    const [option, setOption] = useState("");

    const phoneHandler = function (evt) {
      let ph = evt.target.value;
      setPhno(ph); // Update phno with the entered value
      
      };
    const emailHandler = function (evt) {
      let ph = evt.target.value;
      setEmail(ph); // Update phno with the entered value
      
      };
      // console.log(token,user_id)

    
      async function sendPhone(e) {
        e.preventDefault()
        console.log(phno)
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

      function sendEmail(e){
        localStorage.setItem("email",email)
        console.log(email)
        e.preventDefault()
        axios
        .post("http://localhost:5000/sendEmail",{email:email}) // Pass the phone number as an object in the request body
        .then((res) => {
            alert(res.data);
          if(res.status==250){
            console.log(res.data)
              // window.location.href = "/forgot/otp"
          }
        })
      }

      const clickHandler = function(e){
        if(option){
          console.log(typeof option)
          console.log(option == "phone");
          if(option == "Phone"){
            sendPhone(e);
          }else{
            sendEmail(e)
          }
        }else{
          console.log("please select an option");
        }
      }

      const optionSelector = function(options){
          setOption(options)
          console.log(option);
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
									<div>
                    <input type="radio" name="option" id="phno" value="Phone" onChange={(evt)=>optionSelector(evt.target.value)} /> <label htmlFor="phno">Phone</label>
                    <input type="radio" name="option" id="eml" value="Email" onChange={(evt)=>optionSelector(evt.target.value)} /> <label htmlFor="eml">email</label> 
                  </div>
                  {(option == "Phone")?
										<div >
											<label>Phone</label>
											<input className="form-control form-control-lg" type="number" name="phNum" placeholder="Enter your mobile number" onBlur={(evt)=>phoneHandler(evt)}/>
										</div>:<div >
											<label>Email</label>
											<input className="form-control form-control-lg" type="email" name="email" placeholder="Enter your Email" onBlur={(evt)=>emailHandler(evt)}/>
										</div>
                  }
										<div className="text-center mt-3">
											<button className="btn btn-lg btn-primary" onClick={(evt)=>clickHandler(evt)}>Reset password</button>&nbsp; &nbsp;
											<a href="/" className="btn btn-lg btn-primary">Back to Login</a>
											{/* <button className="btn btn-lg btn-primary" onClick={(evt)=>clickHandler(evt)}>send mail</button>&nbsp; &nbsp; */}
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