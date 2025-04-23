import axios from 'axios';

// Create an Axios instance with the base URL of your FastAPI backend
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI backend URL (adjust as necessary)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
