import axios from 'axios';

/*
Axios instance
Used to connect frontend with backend APIs
*/
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default API;
