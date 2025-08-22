import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7044/api";

const rawApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default rawApi;
