import Axios from "axios";

let backendHost = "http://localhost:3000/";

if (process.env.REACT_APP_NODE_ENV === "production") {
  backendHost = "http://165.22.185.251/api/";
}

const axios = Axios.create({
  baseURL: backendHost,
});

export default axios;
