import {SETTOKEN,SETUSER} from "../actions/action_types"
const initialState = {
    token: '',
    userId: '',
  };
  
  const Authentication = (state = initialState, action) => {
    switch (action.type) {
      case SETTOKEN:
        return {
          ...state,
          token: action.payload,
        };
      case SETUSER:
        return {
          ...state,
          userId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default Authentication;
  