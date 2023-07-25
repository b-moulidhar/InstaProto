import { useState } from "react";
import axios from "axios";
import HeaderComp from "./header.comp";

const UploadComp = () => {
  const [file, setFile] = useState(null);
  const[data,SetData] = useState()

  function inputHandler(evt) {
    setFile(evt.target.files[0]);
  }

  function sendImage(e) {
    e.preventDefault();
    console.log("sending");

    // Create a new FormData instance and append the selected file
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

          alert("data added successfully")
        }
        if(response.status==401){
          alert("please login again")
          
        }
      })
      .catch((err) => {
        alert("please login again")
        console.log("Error ",err);
        window.location.href = "/"
      });
  }

  return (
    <>
    <HeaderComp/>
      <form onSubmit={sendImage}>
        <label htmlFor="file">Select a file:</label>
        <br />
        <input type="file" name="file" id="file" onChange={inputHandler} />
        <br />
        <button type="submit">Upload File</button>
      </form>
    </>
  );
};

export default UploadComp;
