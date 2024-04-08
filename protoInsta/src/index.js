// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { PersistGate } from 'redux-persist/integration/react';
// import {Provider} from "react-redux"
// import {persistor, store} from "./redux/store"


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//  <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//  </Provider>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux"
import store from "./redux/store"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Provider store={store}>
     <App  />
 </Provider>
);