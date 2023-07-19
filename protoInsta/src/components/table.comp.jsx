import { useEffect } from "react"
import axios from "axios";
import { useState } from "react";
 
let TableComp = ()=>{
    let [hero, setHeroes] = useState([]);
    let [nvals,setNvals] = useState({name:'',age:''})
   
 
    let refresh = ()=>{
        axios.get("http://localhost:5000/data").then(res => {
            setHeroes(res.data);
        })
    }
 
    useEffect(function(){
       refresh();
    },[]);

    function clickHandler(evt){
        setNvals({...nvals,[evt.target.id]:evt.target.value})
    }

    let addHero = function(){
        console.log(nvals);
            axios.post("http://localhost:5000/create",nvals)
            .then(res => {
                setNvals({ name : '', age : ''})
                refresh();
            })
            .catch(err => console.log("Error ", err))
    }
 
   
    return <>
        <form>
        <div class="mb-3">
            <label htmlFor="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" onInput={(event)=>{clickHandler(event)}}/>
        </div>
        <div class="mb-3">
            <label htmlFor="age" class="form-label">Age</label>
            <input type="number" class="form-control" id="age" onInput={(event)=>{clickHandler(event)}}/>
        </div>
        <button type="submit" onClick={addHero} class="btn btn-primary">Submit</button>
        </form>
        {console.log(hero)}
    </>
               
}
 
export default TableComp; 
 
 
// http://p.ip.fi/-sGR