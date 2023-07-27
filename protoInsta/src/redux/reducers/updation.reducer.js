const initialState = {
    isValid: false,
    phno: "",
  };
  
  const updation = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_IS_VALID':
        return {
          ...state,
          isValid: action.payload,
        };
      case 'SET_PHNO':
        return {
          ...state,
          phno: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default updation;
  