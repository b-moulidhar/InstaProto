import { NavLink } from "react-router-dom";
import "./header.css"
import Swal from 'sweetalert2'
import { useEffect, useState } from "react";
function HeaderComp(){


    const [link,setLink] = useState("")
    useEffect(()=>{
        let userId = localStorage.getItem("UserId"); 
        const profilePage = "/profileDetails/"+userId;
        setLink(profilePage);
    },[])

    function logout(){
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of this session!",
            icon: 'warning',
            showCancelButton: true,
            background:"#edf2f4",
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position:'top',
                    icon: 'success',
                    title: 'Logged out successfully',
                    showConfirmButton: false,
                    background:"#edf2f4",
                    timer: 1000
                  }).then(()=>{                 
                    localStorage.clear();
                    window.location = "/"
                })      
            }
        })
        
    }
    return(
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
        <NavLink end to="/homePage">
            <button className="btn primary navBtn"><span>Home</span></button>
        </NavLink>
        <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <NavLink end to="/homePage/uploads">
                        <button className="btn primary navBtn"><span>view uploads</span> </button>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink end to="/homePage/userImages">
                        <button className="btn primary navBtn"><span>upload a image</span></button>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink end to={link}>
                        <button className="btn primary navBtn"><span>profile</span></button>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink end to="/homepage/voiceSearch">
                        <button className="btn primary navBtn"><span>voice search</span></button>
                    </NavLink>
                </li>
            </ul>
            <button className="btn primary navBtn" onClick={logout}><span>
                logout</span>
            </button>
        </div>
    </div>
</nav>

        {/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
            <NavLink end  to="/homePage"><button className="btn primary">Home</button></NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <NavLink end  to="/homePage/uploads"><button className="btn primary">viewImages</button></NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink end  to="/homePage/userImages"><button className="btn primary">upload a image</button></NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink end  to="/homePage/profile"><button className="btn primary">profile</button></NavLink>
                    </li>
                    </ul>
               
                    <button className="btn btn-outline-success" onClick={logout}>logout</button>
                </div>
            </div>
        </nav> */}

        </>
    )
}

export default HeaderComp;