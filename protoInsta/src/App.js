import './App.css';
import { BrowserRouter, NavLink, Route,Routes} from "react-router-dom"
import ImageComp from './components/comments.comp';
import TableComp from './components/table.comp';
import ViewComp from './components/viewImages.comp';
import Login from './components/login.comp';
import Register from './components/register.comp';

function App() {
  return<>
      <BrowserRouter>
        <ul>
            <li><NavLink end  to="/">Home Component</NavLink></li>
            <li><NavLink end  to="register">Home Component</NavLink></li>
            <li><NavLink end  to="uploadImage">Upload image</NavLink></li>
            <li><NavLink end  to="viewImages">View images</NavLink></li>
            <li><NavLink end  to="testing">Testing of data</NavLink></li>
        </ul>
        
        
            <Routes>
                <Route path="" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="uploadImage" element={<ImageComp/>}/>
                <Route path="viewImages" element={<ViewComp/>}/>
                <Route path="testing" element={<TableComp/>}/>
            </Routes>
        </BrowserRouter>
  </>
}

export default App;
