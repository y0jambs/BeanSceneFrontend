import axios from "axios";

export default axios.create({
  baseURL: "https://beanscenebackend.onrender.com/api",
  timeout: 10000,
});
