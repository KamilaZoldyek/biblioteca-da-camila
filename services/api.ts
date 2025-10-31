import axios from "axios";


const api = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

// api.interceptors.request.use(
//   (config) => {
//     console.log("sent this data: ", config.data);

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error);
    }
  }
);

export { api };
