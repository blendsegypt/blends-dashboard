import Axios from "axios";

let backendHost = "http://localhost:3000/";

if (process.env.NODE_ENV === "production") {
  backendHost = "https://blendseg.com/api/";
}

const axios = Axios.create({
  baseURL: backendHost,
});

const AuthInterceptor = () => {
  let interceptor;
  return {
    // Activates authentication interceptor on every request
    activate: () => {
      // Access token request patcher
      interceptor = axios.interceptors.request.use(
        async (config) => {
          const accessToken = localStorage.getItem("token");
          config.headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          };
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    // Deactivates authentication interceptor
    deactivate: () => {
      axios.interceptors.request.eject(interceptor);
    },
  };
};

export const authInterceptor = AuthInterceptor();

export default axios;
