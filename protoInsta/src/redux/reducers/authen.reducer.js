const initialState = {
    token: '',
    userId: '',
  };
  
  const Authentication = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TOKEN':
        return {
          ...state,
          token: action.payload,
        };
      case 'SET_USER_ID':
        return {
          ...state,
          userId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default Authentication;
  