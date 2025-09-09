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
   // console.log("got this data:", config.data);
     //console.log("got this request:", config.request);
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
      return Promise.reject(error); //TODO mensagem mais legal
    }
  }
);

export { api };
