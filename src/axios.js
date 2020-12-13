import Axios from "axios";

const port = process.env.PORT || 3000;

const axios = Axios.create({
  baseURL: `http://localhost:${port}`,
});

export default axios;
