import { useState } from "react";
import "../../css/upload.css"
import HeaderComp from "../header/header.comp";
import Api from "../../api/api";
import Swal from "sweetalert2";

const ProfilePicUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  function inputHandler(evt) {
    setPreviewUrl(null);
    const selectedFile = evt.target.files[0];
    if(selectedFile==undefined){
      alert("no file chosen")
    }else{
      setFile(evt.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function sendImage(e) {
    e.preventDefault();
    console.log("sending");

    // Create a new FormData instance and append the selected file
    const formData = new FormData();
    formData.append("file", file);

    let token = localStorage.getItem("Authorization");
    let userId = localStorage.getItem("UserId"); 


    Api.post("/profilePicUpload",formData)
      .then((response) => {
        console.log(response);
        if(response.status===200){
          setPreviewUrl(null);
          setFile(null)
          document.getElementById("file").value = "";
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Your profile pic updated',
            background:"#edf2f4",
            showConfirmButton: false,
            timer: 1000
          }).then(()=>{
            window.location = "/homePage/profile"
        })
        }
      })
      .catch((err) => {
        if(err.response.status==401){
            alert("please login again")
        }
        console.log("Error ",err);
        // window.location.href = "/"
      });
  }

  return (
    <>
    <div className="container">
    <HeaderComp/>
      <form id="uploadForm" onSubmit={sendImage}>
        <label htmlFor="file">Select your profile pic</label>
        <br />
        <input type="file" name="file" id="file" onChange={inputHandler} />
        <br />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "250px", height: "200px" }}
          />
        )}
        <br />
        <button type="submit">update Pic</button>
      </form>
    </div>
    </>
  );
};

export default ProfilePicUpload;
