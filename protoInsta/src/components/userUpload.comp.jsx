import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/userUpload.css"
import HeaderComp from "./header.comp";
import Swal from 'sweetalert2'

const UserUploads = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = localStorage.getItem("Authorization");
    let userId = localStorage.getItem("UserId"); 
  
  const refresh = () => {
    axios.get("http://localhost:5000/getImages",{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    }).then((res) => {
      let tempData = [];
      res.data.forEach((data)=>{
        if(data.uid == userId){
            tempData.push(data);
        }
    })
    if(tempData.length!=0){
        setHeroes(tempData); 
    }else if(tempData.length == 0){
      setHeroes([]);
    }
      setLoading(false);
    })
    .catch((err)=>{
        alert(err, "please login again")
        window.location.href = "/"
    })
  };

  useEffect(() => {
    refresh();
  }, []);

  // Function to convert base64 to blob and create URL
  const createBlobUrl = (base64String, fileType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

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

  // Function to revoke the URL and free up memory
  const revokeBlobUrl = (url) => {
    URL.revokeObjectURL(url);
  };

  function deleteImage(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      background:"#edf2f4",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
      if (result.isConfirmed) {
          axios.delete("http://localhost:5000/deleteUsrUpload",{
            headers: {
              Authorization: `Bearer ${token}`,
              "UserID": userId,
              "imgid":id
            } 
          })
          .then((res)=>{
            refresh();
            if(res.status==200){
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Your Post Has been Deleted successfully',
                background:"#edf2f4",
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
          .catch((err)=>{
            console.log(err)
          })
      }
  })

     
  }

  return (
    <>
    <div className="container">
    <HeaderComp/>

      {loading ? (
        <p>Loading...</p>
      ) : <div className="allUserUploads">
        {
        heroes.length==0 ? <h2>No Images uploaded by you</h2>:
        heroes.map((hero, index) => (
          <div key={index} className="uploads">
            {/* Render the individual properties of the hero object */}
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} />
            <p>{hero.filename}</p>
            <p>{hero.filetype}</p>
            {/* Render the image using createBlobUrl */}
            {hero.filetype === "application/pdf" && (
              <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>
                download
              </a>
            )}
            {console.log(hero.uid,userId)}
            {
              hero.uid == userId &&
            <button onClick={()=>deleteImage(hero.id)} className="deleteUploadBtn">delete upload</button>
            }
            {/* {((hero.filetype === "image/jpeg")||(hero.filetype === "image/png"))&& <p>
              comments: <br />
              <input type="textbox" name="comment" id={hero.filename} />
            </p>
            } */}
           
            {hero.filetype === "application/pdf" && revokeBlobUrl(createBlobUrl(hero.filedata, hero.filetype))}
          </div>
        ))
        }
      </div>
      
      }
    </div>
    </>
  );
};

export default UserUploads;
