import './App.css';
import { BrowserRouter, NavLink, Route,Routes} from "react-router-dom"
import TableComp from './components/table.comp';
import ViewComp from './components/viewImages.comp';
import Login from './components/login.comp';
import Register from './components/register.comp';
import UserUploads from './components/userUpload.comp';
import UploadComp from './components/upload.comp';
import ForgetPass from './components/forgot.comp';

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
                <Route path="profilepage" element={<ViewComp/>}/>
                <Route path="profilepage/uploads" element={<UserUploads/>}/>
                <Route path="profilepage/userImages" element={<UploadComp/>}/>
                {/* <Route path="viewImages" element={<ViewComp/>}/> */}
                <Route path="testing" element={<TableComp/>}/>
            </Routes>
        </BrowserRouter>
  </>
}

export default App;
