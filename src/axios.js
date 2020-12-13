import Axios from "axios";

const backendHost =
  process.env.REACT_APP_BACKEND_HOST || `http://localhost:3000/`;

const axios = Axios.create({
  baseURL: backendHost,
});

export default axios;
