import axios from "axios";

const api = axios.create({
  baseURL: "https://sasvoix-backend.onrender.com/api",
});

export default api;