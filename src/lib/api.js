import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true
});

// 🔥 token automatically add hoga
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }

    return req;
});

export default API;
