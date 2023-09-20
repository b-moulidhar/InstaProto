import { useEffect } from "react"
import { useState } from "react";
import "../css/profileComp.css"
import HeaderComp from "./header.comp";
import { NavLink } from "react-router-dom";
import Api from "../api/api";
import Swal from "sweetalert2";
 
let ProfileComp = ()=>{
    let [userData, setUserData] = useState([]);
    // let [nvals,setNvals] = useState({name:'',age:''});
    
 
    let refresh = ()=>{
    Api.get('/profileDetails')
    .then((res)=>{
        if(res.status==401){
            alert("session expired");
        }
        setUserData(res.data);
    }).catch(err=>{
        console.log(err)
        if(err.response.status==401){
            alert("session expired")
            // window.location = "/";
        }
    })
    }
 
    useEffect(function(){
       refresh();
    },[]);

    function changeImage(evt){
        if(evt.target.id=="insertPic"){
            document.getElementById("picUpload").click()
        }else if(evt.target.id=="deletePic"){
            
            Swal.fire({
                title: 'Are you sure?',
                text: "Your picture will be removed",
                icon: 'warning',
                showCancelButton: true,
                background:"#edf2f4",
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove!'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                    Api.delete("/profilepicDelete")
            .then((res)=>{
                if(res.status==200){
                    Swal.fire(
                        'profile pic deleted',
                        'your profile pic has been deleted',
                        'success'
                    ).then(()=>{
                        refresh();
                    })
                }
            }).catch(err=>{
                console.log(err)
                if(err.response.status==401){
                    alert("session expired")
                    // window.location = "/";
                }
            })      
                }
            })
        }

    }

    const createBlobUrl = (base64String, fileType) => {
        console.log(base64String)
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        console.log(byteArray)
    
        // Set the correct MIME type based on the fileType parameter
        let mimeType;
        switch (fileType) {
          case "image/jpeg":
            mimeType = "image/jpeg";
            break;
          case "application/pdf":
            mimeType = "application/pdf";
            break;
          case "image/png":
            mimeType = "image/png";
            break;
          default:
            mimeType = "image/png"; // Default to image/jpeg if the fileType is unknown
            break;
        }
    
        const blob = new Blob([byteArray], { type: mimeType });
        return URL.createObjectURL(blob);
      };

      function popUp(){
        var x = document.getElementsByClassName("editPopUp")[0];
        let y = document.getElementById("profileData");
        if (x.style.display === "none") {
            document.getElementById("profileData").addEventListener("click", function() {
                this.style.filter = "none";
                x.style.display = "none";
              });
            y.style.filter = "blur(5px)";
            x.style.display = "flex";
        } else {
            y.style.filter = "none";
            x.style.display = "none";
          }
      }

  
    return <>
    <HeaderComp/>
    <NavLink end to="/homePage/profile/picUpload" id="picUpload"></NavLink>
    {console.log()}
            {
                userData.length>0 &&
                

        <form id="profileData">
            
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" onClick={popUp}>
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            {/* <select  name="edit" id="" onChange={(evt)=>{changeImage(evt)}}>
                <option value="">edit pic</option>
                <option value="insertPic">add image</option>
                <option value="deletePic">remove image</option>
            </select> */}
           
            {
                userData[0].profilepic!=null ?
            <img src={createBlobUrl(userData[0].profilepic, "image/jpeg")} alt="user Pic" />:
            <img src="../assets/images/defaultProfilePic.jpg" alt="user Pic1" />
            }
            <h3>Hello, {userData[0].u_name}</h3>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">User ID : {userData[0].id}</label>
            </div>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">User Mail : {userData[0].email}</label>
            </div>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">User Mobile : {userData[0].mobile}</label>
            </div>
        </form>
        }
            <div className="editPopUp">
                <div  id="insertPic" onClick={(evt)=>{changeImage(evt)}}>Insert Pic</div>
                <div  id="deletePic" onClick={(evt)=>{changeImage(evt)}}>Delete Pic</div>
            </div>
   
    </>
               
}
 
export default ProfileComp; 
 
 
// http://p.ip.fi/-sGR