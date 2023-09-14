import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/viewComp.css"
import HeaderComp from "./header.comp";
import { useSelector } from "react-redux";

const ViewComp = () => {
  const [heroes, setHeroes] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [comments, setComments] = useState({ image_id:Number , cmts:"" });
  const [loading, setLoading] = useState(true);
  const [hideCmt, setHideCmt] = useState();
  const [showCmt, setShowCmt] = useState();
  const ctoken = useSelector(state=> state.authentication.token);
   

  let token = localStorage.getItem("Authorization");
    let userId = localStorage.getItem("UserId"); 
    const user_id = useSelector(state=> state.authentication.userId);
  
  const refresh = () => {
    axios.get("http://localhost:5000/getImages",{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    }).then((res) => {
      setHeroes(res.data);
      console.log(user_id,ctoken)
      
      axios.get("http://localhost:5000/comments",{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    }).then((res) => {
      setAllComments(res.data);
      setLoading(false);
    })
    .catch((err)=>{
      alert(err, "please login again");
      window.location = "/"
    })

    })
    .catch((err)=>{
      alert(err, "please login again")
      window.location = "/"
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
  function postComment(hid){
    let element = document.getElementById(hid);
    element.value = ""
      console.log(element)
    axios.post("http://localhost:5000/comments", comments,{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    })
    .then((res)=>{
      
      if(res.status==200){
        alert("posted successfully")
      }
      console.log(res.data)
      refresh()
    })
    .catch((err)=>{
      console.log(err)
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
      if(res.status==200){
        alert("deleted successfully")
        refresh();
      }
      console.log(res.status)
    })
    .catch((err)=>{
      alert("Error", err)
    })
  }
  const handleShowClick = (event, imageId) => {

    
    let showBtn = document.getElementById(event.target.id);
    let hideBtn = document.getElementById("hideCmtBtn"+imageId);
      showBtn.style.display = "none"
      hideBtn.style.display = "flex"
    setHideCmt(imageId)
    // Get the clicked element
    const element = event.target;
    let top = element.offsetTop;
    let left = element.offsetLeft;
  
    // Find the mainTag element for the corresponding imageId
    const mainTag = document.querySelectorAll(`.allComments_${imageId}`);
    if (mainTag) {
      mainTag.forEach(element => {
        
        element.style.display = "flex";
        element.style.top = top + "px"; // Make sure to add "px" to the value
        element.style.left = left + "px"; // Make sure to add "px" to the value
      });
      // Apply styles to the clicked element
    }
  };

  const handleHideClick = (event, imageId) => {

    setShowCmt(imageId)

    let showBtn = document.getElementById("showCmtBtn"+imageId);
    let hideBtn = document.getElementById(event.target.id);
    showBtn.style.display = "flex"
    hideBtn.style.display = "none"
    setHideCmt(undefined)
    // Get the clicked element
    // Find the mainTag element for the corresponding imageId
    const mainTag = document.querySelectorAll(`.allComments_${imageId}`);
    if (mainTag) {
      mainTag.forEach(element => {
        
        element.style.display = "none";
       
      });
      // Apply styles to the clicked element
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
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} />
            <p>{hero.filename}</p>
            {/* Render the image using createBlobUrl */}
            {hero.filetype === "application/pdf" && (
              <a href={createBlobUrl(hero.filedata, hero.filetype)} download={hero.filename}>
                download
              </a>
            )}
            {/* {
              (showCmt == hero.id) &&
              <button onClick={(evt)=>handleShowClick(evt,hero.id)} class="showCmtBtn">show all comments</button>
            } */}
            <button onClick={(evt)=>handleShowClick(evt,hero.id)} id={"showCmtBtn"+hero.id} className="showBtnCmt">show all comments</button>
            {
              <button onClick={(evt)=>handleHideClick(evt,hero.id)} id={"hideCmtBtn"+hero.id} className="hideBtnCmt" style={{display:"none"}}>hide all comments</button>
            }
              

            {((hero.filetype === "image/jpeg")||(hero.filetype === "image/png"))&& <p id="cmntsSection">
              <div className="allCmnt">
              {
                allComments.map((val, idx) => {
                  if (val.image_id === hero.id) {
                    return (
                      <div key={idx} className={"allComments_" + val.image_id} style={{ display: "none" }}>
                        <p className="cmnt"><span>{val.user_id}</span>: <span>{val.u_comment}</span> &nbsp;
                        {val.user_id === Number(userId) && <button id="deleteCmntBtn" onClick={() => deleteComment(val.id)}>delete</button>}
                        </p>
                      </div>
                    );
                  }
                })
              }
              </div>


              any comments? <br />
              <input type="textbox" name="comment" id={hero.id} onInput={(evt)=>{comment(evt,hero.id)}}/>
              <button onClick={()=>postComment(hero.id)} id="postCmntBtn">Post Comment</button>
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
