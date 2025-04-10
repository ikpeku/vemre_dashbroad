

import axios from "axios";

// const BaseUrl = "https://vemre-bg.vercel.app"
const BaseUrl = "http://localhost:3000"

 const rootAxiosInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Acess-Control-Allow-Origin': '*',
    'Accept': "application/json"
  }
});

rootAxiosInstance.interceptors.request.use(
  async(config) => {
    const token = localStorage.getItem("accessToken");
    // const token = await AsyncStorage.getItem('accessToken');
    // console.log("mannToken",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default rootAxiosInstance;
