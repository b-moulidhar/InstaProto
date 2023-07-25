import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/viewComp.css"
import HeaderComp from "./header.comp";

const ViewComp = () => {
  const [heroes, setHeroes] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [comments, setComments] = useState({ image_id:Number , cmts:"" });
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
      setHeroes(res.data);
      
      axios.get("http://localhost:5000/comments",{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    }).then((res) => {
      setAllComments(res.data);
      console.log(res.data);
      setLoading(false);
    })
    .catch((err)=>{
      alert(err, "please login again")
    })

    })
    .catch((err)=>{
      alert(err, "please login again")
    })
  };
  useEffect(() => {
    console.log(comments);
  }, [comments]);
  

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

  function comment(evt, imageId) {
    setComments({ ...comments, image_id: imageId, cmts: evt.target.value });
    console.log(comments);
  }
  function postComment(){
    axios.post("http://localhost:5000/comments", comments,{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    })
    .then((res)=>{
      alert("posted successfully"  )
      console.log(res.data)
      refresh()
    })
    .catch((err)=>{
      alert("Error", err)
    })
  }
  function deleteComment(cmtId){
    axios.delete("http://localhost:5000/comments",{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
        "commentId":cmtId
      } 
    })
    .then((res)=>{
      alert("posted successfully"  )
      console.log(res.data)
      refresh();
    })
    .catch((err)=>{
      alert("Error", err)
    })
  }
  const handleClick = (event, imageId) => {
    // Get the clicked element
    const element = event.target;
    let top = element.offsetTop;
    let left = element.offsetLeft;
  
    // Find the mainTag element for the corresponding imageId
    const mainTag = document.querySelector(`.allComments_${imageId}`);
    if (mainTag) {
      // Apply styles to the clicked element
      mainTag.style.display = "block";
      mainTag.style.top = top + "px"; // Make sure to add "px" to the value
      mainTag.style.left = left + "px"; // Make sure to add "px" to the value
    }
  };
  
  
  

  return (
    <>
    <div className="container">
      <HeaderComp/>
      {loading ? (
        <p>Loading...</p>
      ) : (
        heroes.map((hero, index) => (
          <div key={index} className="items">
            {/* Render the individual properties of the hero object */}
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} height="150px" width="150px" />
            <p>{hero.filename}</p>
            {/* Render the image using createBlobUrl */}
            {hero.filetype === "application/pdf" && (
              <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>
                download
              </a>
            )}
            {((hero.filetype === "image/jpeg")||(hero.filetype === "image/png"))&& <p>
              <button onClick={(evt)=>handleClick(evt,hero.id)}>show all comments</button>
              {
                allComments.map((val,idx)=>{
                  if(val.image_id == hero.id){
                    return (
                    <div key={idx} className={"allComments_"+val.image_id} style={{display:"none"}}>
                      <p>{val.user_id}</p>
                      <p>{val.u_comment}</p>
                      {val.user_id==userId && <button onClick={()=>deleteComment(val.id)}>delete</button>}
                    </div>
                    )
                  }

                })
              }

              comments: <br />
              <input type="textbox" name="comment" id={hero.filename} onInput={(evt)=>{comment(evt,hero.id)}}/>
              <button onClick={postComment}>Post Comment</button>
              {/* {(hero.uid === userId) && <button onClick={deleteComment}>delete comment</button>} */}
            </p>
            }
            {/* Don't forget to revoke the URL after the download link is clicked */}
            {hero.filetype === "application/pdf" && revokeBlobUrl(createBlobUrl(hero.filedata, hero.filetype))}
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default ViewComp;
