import './App.css';
import { BrowserRouter, NavLink, Route,Routes} from "react-router-dom"
import TableComp from './components/table.comp';
import ViewComp from './components/Homepage/viewImages.comp';
import Login from './components/login/login.comp';
import Register from './components/register/register.comp';
import UserUploads from './components/uploads/userUpload.comp';
import UploadComp from './components/uploads/upload.comp';
import ForgetPass from './components/forgot/forgot.comp';
import OtpComp from './components/forgot/otp.comp';
import NewPass from './components/forgot/newPass.comp';
import ProfileComp from './components/profile/profile.comp';
import ProfilePicUpload from './components/profile/profilePicUpload.comp';

function App() {
  return<>
      <BrowserRouter>
        {/* <ul>
            <li><NavLink end  to="/">Home Component</NavLink></li>
            <li><NavLink end  to="register">Home Component</NavLink></li>
            <li><NavLink end  to="uploadImage">Upload image</NavLink></li>
            <li><NavLink end  to="viewImages">View images</NavLink></li>
            <li><NavLink end  to="testing">Testing of data</NavLink></li>
        </ul> */}
        
        
            <Routes>
                <Route path="" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="forgot" element={<ForgetPass/>}/>
                <Route path="forgot/otp" element={<OtpComp/>}/>
                <Route path="newpassword" element={<NewPass/>}/>
                <Route path="HomePage" element={<ViewComp/>}/>
                <Route path="homePage/uploads" element={<UserUploads/>}/>
                <Route path="homePage/userImages" element={<UploadComp/>}/>
                <Route path="homePage/profile" element={<ProfileComp/>}/>
                <Route path="homePage/profile/picUpload" element={<ProfilePicUpload/>}/>
                {/* <Route path="viewImages" element={<ViewComp/>}/> */}
                <Route path="testing" element={<TableComp/>}/>
            </Routes>
        </BrowserRouter>
  </>
}

export default App;
