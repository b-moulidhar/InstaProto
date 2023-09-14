import axios from 'axios';

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
      // Handle unauthorized error
      window.location.href = '/';
    } 
    // else if (!error.response) {
    //   // Handle network error
    //   console.log('Network Error');
    // }
    return Promise.reject(error);
  }
);

export default Api;
