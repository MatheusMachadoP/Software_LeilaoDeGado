import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.11.167:3002',
});

export default api;