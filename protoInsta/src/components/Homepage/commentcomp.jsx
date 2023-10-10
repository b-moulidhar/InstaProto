import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Api from '../../api/api';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import createBlobUrl from '../BlobToImage/blobToImage';

const CommentComp = (heros) => {
    const {hero} = heros;
    const [allComments, setAllComments] = useState([]);
    const [userData,setUserData]= useState([]);
    const [comments, setComments] = useState({ image_id:Number , cmts:"" });
    const [hideCmt, setHideCmt] = useState();
    const [showCmt, setShowCmt] = useState();

    let token = localStorage.getItem("Authorization");
    let userId = localStorage.getItem("UserId"); 

    function refresh(){
        Api.get("/comments")
        .then((res) => {
        setAllComments(res.data);
        if(res.status==401){
            Swal.fire({
                position: 'top',
                icon: 'error',
                text: 'session timed Out',
                timer: 2000
              }).then(()=>{
                window.location = "/";
              })
        }
        })
        .catch((err)=>{
            console.log(err)
            if(err.response.status==401){
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    text: 'session timed Out',
                    timer: 2000
                  }).then(()=>{
                    window.location = "/";
                  })
            }
        })

        Api.get("/data")
        .then((res)=>{
            setUserData(res.data);
            if(res.status==401){
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    text: 'session timed Out',
                    timer: 2000
                  }).then(()=>{
                    window.location = "/";
                  })
            }
        }).catch((err)=>{
            console.log(err)
        if(err.response.status==401){
            Swal.fire({
                position: 'top',
                icon: 'error',
                text: 'session timed Out',
                timer: 2000
              }).then(()=>{
                window.location = "/";
              })
        }
        })
    }

        useEffect(()=>{
            refresh();
        },[hero])

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
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        text: 'deleted succesfully',
                        timer: 1500
                      }).then(()=>{
                          refresh();
                      })
              }
              else if(res.status==401){
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    text: 'session timed Out',
                    timer: 2000
                  }).then(()=>{
                    window.location = "/";
                  })
            }
              console.log(res.status)
            })
            .catch((err)=>{
                console.log(err)
                if(err.response.status==401){
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        text: 'session timed Out',
                        timer: 2000
                      }).then(()=>{
                        window.location = "/";
                      })
                }
            })
          }
          function comment(evt, imageId) {
            setComments({ ...comments, image_id: imageId, cmts: evt.target.value });
            console.log(comments);
          }
          function postComment(hid){
            let element = document.getElementById(hid);
            element.value = ""
              console.log(element);
            Api.post("/comments", comments)
            .then((res)=>{
              
              if(res.status==200){
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        text: 'Posted succesfully',
                        timer: 2000
                      }).then(()=>{
                          refresh();
                      })
              }
              console.log(res.data);
            })
            .catch((err)=>{
                console.log(err)
                if(err.response.status==401){
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        text: 'session timed Out',
                        timer: 2000
                      }).then(()=>{
                        window.location = "/";
                      })
                }
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
  return <>
  <button onClick={(evt)=>handleShowClick(evt,hero.id)} id={"showCmtBtn"+hero.id} className="showBtnCmt">show all comments</button>
            {
              <button onClick={(evt)=>handleHideClick(evt,hero.id)} id={"hideCmtBtn"+hero.id} className="hideBtnCmt" style={{display:"none"}}>hide all comments</button>
            }
              

            {((hero.filetype === "image/jpeg")||(hero.filetype === "image/png"))&& <p id="cmntsSection">
  
    <div className="allCmnt">
              {
                allComments.map((val, idx) => {
                    let usrid;
                    let profilepic
                let data = userData.map((users)=>{
                    if(users.id==val.user_id){
                        if (val.image_id === hero.id) {
                          usrid = users.id ; 
                          profilepic = users.profilepic;
                        return users.u_name;
                    }
                  }
                  })
                  if (val.image_id === hero.id && usrid) {
                  return (
                    <div key={idx} className={"allComments_" + val.image_id} style={{ display: "none" }}>
                    <p className="cmnt"><span className='commentator'><NavLink to={"/profileDetails/"+usrid}><img src={createBlobUrl(profilepic, "image/jpeg")} alt="user Pic" width="30px" className='commenterImg' />{data}</NavLink></span>: <span>{val.u_comment}</span> &nbsp;
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
              </p>
            }
         
  </>
  
}

export default CommentComp;