// src/redux/reducers.js
import {CLEAR_STORE} from "../actions/action_types"

const initialStateAuth = {
    token: '',
    userId: '',
  };
  
  // Initial state for formReducer (isValid and phno)
  const initialStateForm = {
    isValid: false,
    phno: '',
  };
// Reducer for the token and userId
const authReducer = (state = initialStateAuth, action) => {
    switch (action.type) {
      // Other action cases...
      case CLEAR_STORE:
        return initialStateAuth; // Reset the auth state to its initial state
      default:
        return state;
    }
  };
  
  // Reducer for isValid and phno
  const formReducer = (state = initialStateForm, action) => {
    switch (action.type) {
      // Other action cases...
      case CLEAR_STORE:
        return initialStateForm; // Reset the form state to its initial state
      default:
        return state;
    }
  };

  export {formReducer, authReducer}
  