import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/viewComp.css"
import HeaderComp from "./header.comp";
import { useSelector } from "react-redux";
import Api from "../api/api";
import Swal from "sweetalert2";

const ViewComp = () => {
  const [ heroes, setHeroes] = useState([]);
  const [userData,setUserData]= useState([])
  const [allComments, setAllComments] = useState([]);
  const [likes,setLikes] = useState();
  const [comments, setComments] = useState({ image_id:Number , cmts:"" });
  const [loading, setLoading] = useState(true);
  const [hideCmt, setHideCmt] = useState();
  const [showCmt, setShowCmt] = useState();
  const ctoken = useSelector(state=> state.authentication.token);

 
   

  let token = localStorage.getItem("Authorization");
    let userId = localStorage.getItem("UserId"); 
    const user_id = useSelector(state=> state.authentication.userId);
  
  const refresh = () => {

    Api.get("/getLikes")
    .then((res)=>{
        console.log(res)
        setLikes(res.data);
    })
    .catch((err)=>{
        console.log(err)
    })

    Api.get("/data")
    .then((res)=>{
        setUserData(res.data);
        console.log(userData);
        console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    })
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
  useEffect(() => {
    if(document.getElementsByClassName("allImages").length>0){

    const container = document.getElementsByClassName("container")[0];
    const image = Array.from(document.getElementsByClassName("allImages"));
console.log(image[0]);
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;



image.forEach((imgs)=>{
  imgs.addEventListener("wheel", (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.0005; // Adjust the delta multiplier for slower zoom
    scale = Math.min(Math.max(1, scale), 1.5); // Adjust min and max zoom levels
    updateImage(imgs);
    container.addEventListener("mousedown", (e) => {
          isDragging = true;
          offsetX = e.clientX - container.getBoundingClientRect().left;
          offsetY = e.clientY - container.getBoundingClientRect().top;
          console.log("drg",offsetX,offsetY);
      });
    
      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const x = e.clientX - container.getBoundingClientRect().left;
        const y = e.clientY - container.getBoundingClientRect().top;
        const deltaX = x - offsetX;
        const deltaY = y - offsetY;
        offsetX = x;
        offsetY = y;
        container.scrollLeft -= deltaX;
        container.scrollTop -= deltaY;
        console.log("drg",container.scrollLeft,y);
      });
      window.addEventListener("mouseup", () => {
          isDragging = false;
      });
      
    });
  })
  function updateImage(imgs) {
      imgs.style.transform = `scale(${scale})`;
  }  


  }  
}, [allComments]);
   

  const postLike = (imageId)=>{
    const imageid = imageId;
    console.log("imageId",imageid)
    Api.post("/postLikes",{imageId:imageid})
    .then((res)=>{
        if(res.status==200){
          console.log("liked successfully")
          refresh();
        }
    })
    .catch((err)=>{
        console.log(err);
    })
  }
  const unPostLike = (imageId)=>{
    // const imageid = imageId;
    console.log("imageId",imageId)
    Api.delete(`/unPostLikes/${imageId}`)
    .then((res)=>{
        if(res.status==200){
          console.log("removed successfully")
          refresh();
        }
    })
    .catch((err)=>{
        console.log(err);
    })
  }

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
      console.log(element);
    axios.post("http://localhost:5000/comments", comments,{
      headers: {
        Authorization: `Bearer ${token}`,
        "UserID": userId,
      } 
    })
    .then((res)=>{
      
      if(res.status==200){
        alert("posted successfully");
      }
      console.log(res.data);
      refresh();
    })
    .catch((err)=>{
      console.log(err)
      alert("Error", err);
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
        <h2 id="noImagesData">Loading...</h2>
      ) : (
        heroes.map((hero, index) => {
            const likedHero = likes.find((data) => data.image_id === hero.id && Number(userId) === data.u_id)
            const numLikes = likes.filter((data) =>{
              if(data.image_id === hero.id){
                  return data;
            }              
            })
          return  (
          <div key={index} className="items">
            {
              // Check if the user has liked the hero

              // Render the like button based on whether the user has liked the hero
              likedHero ? (
                <div className="likeBtn liked" onClick={() => unPostLike(hero.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                  </svg>
                </div>
              ) : (
                <div className="likeBtn" onClick={() => postLike(hero.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                  </svg>
                </div>
              )
            }
            <h4 id="numLikes">{numLikes.length}</h4>

            {/* Render the individual properties of the hero object */}
            <img src={createBlobUrl(hero.filedata, hero.filetype)} alt={`Hero ${index}`} className="allImages" />
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
                let data = userData.map((users)=>{
                    if(users.id==val.user_id){
                      if (val.image_id === hero.id) {
                        
                        return users.u_name;
                    }
                  }
                  })
                  if (val.image_id === hero.id) {
                  return (
                    <div key={idx} className={"allComments_" + val.image_id} style={{ display: "none" }}>
                    <p className="cmnt"><span>{data}</span>: <span>{val.u_comment}</span> &nbsp;
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
            )
})
      )
      }
    </div>
    </>
  );
};

export default ViewComp;
