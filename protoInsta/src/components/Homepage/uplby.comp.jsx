import React, { useEffect, useState } from 'react'
import Api from '../../api/api';
import { NavLink } from 'react-router-dom';
import "./uploadbyComp.css"

const UplodedByComp = (props) => {
    const {hero} = props;
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        if(hero){
            Api.get("/data")
            .then((res)=>{
                setUsers(res.data)
            })
            .catch((err)=>{
                alert(err);
            })
        }
    },[hero]);

  return <>
   <div className='profileLinks'>


        {
            users && users.map((data)=>{
                if(data.id==hero.uid)
                return <NavLink to={"/profileDetails/"+data.id}>uploaded by : {data.u_name}</NavLink>;
            })
        }
       </div>
  </>
}

export default UplodedByComp;