import { useEffect } from "react"
import axios from "axios";
import { useState } from "react";
 
let ViewComp = ()=>{
    let [hero, setHeroes] = useState([]);
   
 
    let refresh = ()=>{
        axios.get("http://localhost:5000/getImages").then(res => {
            setHeroes(res.data);
        })
    }
 
    useEffect(function(){
       refresh();
    },[]);
   
    return <>
       {hero}
        {console.log(hero)}
    </>
               
}
 
export default ViewComp; 
 