import './App.css';
import { BrowserRouter, NavLink, Route,Routes} from "react-router-dom"
import TableComp from './components/table.comp';
// import Login from './components/login/login.comp';
// import Register from './components/register/register.comp';
// import UserUploads from './components/uploads/userUpload.comp';
// import UploadComp from './components/uploads/upload.comp';
// import ForgetPass from './components/forgot/forgot.comp';
// import OtpComp from './components/forgot/otp.comp';
// import NewPass from './components/forgot/newPass.comp';
// import ProfilePicUpload from './components/profile/profilePicUpload.comp';
// import ProfileComp from './components/profile/profile.comp';
import React, { Suspense } from 'react';

let VoiceSearchComp = React.lazy(()=> import('./components/VoiceSearch/VoiceSearch'))
let ProfileComp = React.lazy(()=> import('./components/profile/profile.comp'))
let ProfilePicUpload = React.lazy(()=> import('./components/profile/profilePicUpload.comp'))
let NewPass = React.lazy(()=> import('./components/forgot/newPass.comp'))
let OtpComp = React.lazy(()=> import('./components/forgot/otp.comp'))
let ForgetPass = React.lazy(()=> import('./components/forgot/forgot.comp'))
let UploadComp = React.lazy(()=> import('./components/uploads/upload.comp'))
let UserUploads = React.lazy(()=> import('./components/uploads/userUpload.comp'))
let Register = React.lazy(()=> import('./components/register/register.comp'))
let Login = React.lazy(()=> import('./components/login/login.comp'))
let ViewComp = React.lazy(()=> import('./components/Homepage/viewImages.comp'))

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
                <Route path="register"  element={<Suspense fallback={<> loading...</>}><Register/> </Suspense> }/>
                <Route path="forgot"  element={<Suspense fallback={<> loading...</>}><ForgetPass/> </Suspense> }/>
                <Route path="forgot/otp"  element={<Suspense fallback={<> loading...</>}><OtpComp/> </Suspense> }/>
                <Route path="newpassword"  element={<Suspense fallback={<> loading...</>}><NewPass/> </Suspense> }/>
                <Route path="HomePage"  element={<Suspense fallback={<> loading...</>}><ViewComp/> </Suspense> }/>
                <Route path="homePage/uploads"  element={<Suspense fallback={<> loading...</>}><UserUploads/> </Suspense> }/>
                <Route path="homePage/userImages"  element={<Suspense fallback={<> loading...</>}><UploadComp/> </Suspense> }/>
                {/* <Route path="homePage/profile" element={<ProfileComp/>}/> */}
                <Route path="homePage/profile/picUpload"  element={<Suspense fallback={<> loading...</>}><ProfilePicUpload/> </Suspense> }/>
                <Route path="profileDetails/:id"  element={<Suspense fallback={<> loading...</>}><ProfileComp/> </Suspense> }/>
                <Route path="homepage/voiceSearch"  element={<Suspense fallback={<> loading...</>}><VoiceSearchComp/> </Suspense> }/>
                {/* <Route path="viewImages" element={<ViewComp/>}/> */}
                <Route path="testing" element={<TableComp/>}/>
            </Routes>
        </BrowserRouter>
  </>
}

export default App;
