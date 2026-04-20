import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api"
    baseURL: ["https://safargo.onrender.com/api" , "http://localhost:5000/api"]
});

export default API;