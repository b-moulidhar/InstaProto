import './App.css';
import { BrowserRouter, NavLink, Route,Routes} from "react-router-dom"
import ImageComp from './components/comments.comp';
import TableComp from './components/table.comp';
import ViewComp from './components/viewImages.comp';

function App() {
  return<>
      <BrowserRouter>
        <ul>
            <li><NavLink end  to="/">Home Component</NavLink></li>
            <li><NavLink end  to="uploadImage">Upload image</NavLink></li>
            <li><NavLink end  to="viewImages">View images</NavLink></li>
        </ul>
        
        
            <Routes>
                <Route path="" element={<TableComp/>}/>
                <Route path="uploadImage" element={<ImageComp/>}/>
                <Route path="viewImages" element={<ViewComp/>}/>
            </Routes>
        </BrowserRouter>
  </>
}

export default App;
