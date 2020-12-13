import Axios from "axios";

const backendHost = process.env.BACKEND_HOST || `http://localhost:3000/`;

const axios = Axios.create({
  baseURL: backendHost,
});

export default axios;
