import React, { useEffect, useState } from 'react'
import Api from '../../api/api';
import { NavLink } from 'react-router-dom';
import "./uploadbyComp.css"
import Swal from 'sweetalert2';
import createBlobUrl from '../BlobToImage/blobToImage';

const UplodedByComp = (props) => {
    const {hero} = props;
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        if(hero){
            Api.get("/data")
            .then((res)=>{
                setUsers(res.data)
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
        }
    },[hero]);

  return <>
   <div className='profileLinks'>


        {
            users && users.map((data)=>{
                if(data.id==hero.uid)
                return <NavLink to={"/profileDetails/"+data.id}><img src={createBlobUrl(data.profilepic, "image/jpeg")} alt="user Pic" width="50px" className='commenterImg' />  {data.u_name}</NavLink>;
            })
        }
       </div>
  </>
}

export default UplodedByComp;