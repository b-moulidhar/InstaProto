import { useState } from "react";
import axios from "axios";
import "../../css/upload.css"
import HeaderComp from "../header/header.comp";
import Swal from "sweetalert2";

const UploadComp = () => {
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
    if(file==null){
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'No image selected',
        background:"#edf2f4",
      })
    }else{

      const formData = new FormData();
      formData.append("file", file);
  
      let token = localStorage.getItem("Authorization");
      let userId = localStorage.getItem("UserId"); 
  
  
      axios
        .post("http://localhost:5000/upload", formData,{
          headers: {
            Authorization: `Bearer ${token}`,
            "UserID": userId,
          } 
        })
        .then((response) => {
          console.log(response);
          if(response.status===200){
            setPreviewUrl(null);
            setFile(null)
            document.getElementById("file").value = "";
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'your post uploaded successfully',
              background:"#edf2f4",
              showConfirmButton: false,
              timer: 1000
            })
          }
        })
        .catch((err) => {
          alert("please login again")
          console.log("Error ",err);
          window.location.href = "/"
        });
    }
    // Create a new FormData instance and append the selected file
  }

  return (
    <>
    <div className="container">
    <HeaderComp/>
      <form id="uploadForm" onSubmit={sendImage}>
        <label htmlFor="file">Select a file:</label>
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
        <button type="submit">Upload File</button>
      </form>
    </div>
    </>
  );
};

export default UploadComp;
