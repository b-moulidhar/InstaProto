import axios from 'axios';
import Swal from 'sweetalert2';

const Api = axios.create({
  baseURL: 'http://localhost:5000/',
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization');
    const userId = localStorage.getItem("UserId"); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers["UserID"]= userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: 'session timed Out',
        timer: 2000
      }).then(()=>{
        window.location = "/";
      })
    } 
    // else if (!error.response) {
    //   // Handle network error
    //   console.log('Network Error');
    // }
    return Promise.reject(error);
  }
);

export default Api;
