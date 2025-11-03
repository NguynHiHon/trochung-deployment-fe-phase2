import axios from 'axios';

// Config axios một lần cho toàn project
// Use environment variable REACT_APP_API_URL when provided, otherwise fall back to deployed backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://trochung-deployment-phase2.onrender.com';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export default axios;