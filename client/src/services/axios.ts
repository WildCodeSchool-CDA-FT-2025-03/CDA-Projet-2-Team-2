import axios from 'axios';

const axiosclient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
});

export default axiosclient;
