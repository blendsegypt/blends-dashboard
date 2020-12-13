import Axios from "axios";

const port = process.env.BACK_END_PORT || 3000;

const axios = Axios.create({
  baseURL: `http://localhost:${port}`,
});

export default axios;
