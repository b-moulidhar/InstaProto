import {SETPHNO,SETVALID} from "../actions/action_types"
const initialState = {
    isValid: false,
    phno: "",
  };
  
  const updation = (state = initialState, action) => {
    switch (action.type) {
      case SETVALID:
        return {
          ...state,
          isValid: action.payload,
        };
      case SETPHNO:
        return {
          ...state,
          phno: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default updation;
  