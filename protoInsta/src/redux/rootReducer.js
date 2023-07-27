// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import updation from './reducers/updation.reducer';
import Authentication from './reducers/authen.reducer';


const rootReducer = combineReducers({
  updation: updation,
  authentication: Authentication

});

export default rootReducer;
