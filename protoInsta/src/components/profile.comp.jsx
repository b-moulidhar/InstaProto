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
        console.log(res.data);
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
        if(evt.target.value=="insertPic"){
            document.getElementById("picUpload").click()
        }else if(evt.target.value=="deletePic"){
            alert("delete")
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
                console.log(res);
            }).catch(err=>{
                console.log(err)
                if(err.response.status==401){
                    alert("session expired")
                    // window.location = "/";
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

  
    return <>
    <HeaderComp/>
    <NavLink end to="/homePage/profile/picUpload" id="picUpload"></NavLink>
    {console.log()}
            {
                userData.length>0 &&

        <form id="profileData">
            <select name="edit" id="" onChange={(evt)=>{changeImage(evt)}}>
                <option value="">edit pic</option>
                <option value="insertPic">add image</option>
                <option value="deletePic">remove image</option>
            </select>
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

   
    </>
               
}
 
export default ProfileComp; 
 
 
// http://p.ip.fi/-sGR