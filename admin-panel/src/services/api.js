import axios from "axios";

const token = localStorage.getItem("token");

export default axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://nadi-buhrain-render.onrender.com/api",
  headers: { Authorization: `Bearer ${token}` },
});