import {SETPHNO,SETTOKEN,SETUSER,SETVALID,CLEAR_STORE} from "./action_types"

let isvalid = (valid)=>{
    return{
        type : SETVALID,
        payload: valid
    }
}
let setMobile = (phno)=>{
    return{
        type : SETPHNO,
        payload: phno
    }
}
let setUser = (user)=>{
    return{
        type : SETUSER,
        payload: user
    }
}
let setToken = (token)=>{
    return{
        type : SETTOKEN,
        payload: token
    }
}
const clearStore = () => {
    return {
      type: CLEAR_STORE,
    };
  };

export { isvalid , setMobile, setUser, setToken,clearStore}