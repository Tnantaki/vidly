import axios from "axios";
import { toast } from 'react-toastify'
import { apiUrl } from '../config.json'

// const baseURL = import.meta.env.VITE_API_URL || apiUrl

// take 2 callback function, 1st: call when success, 2nd: call when fail
axios.interceptors.response.use(null, (err) => {
  const exErr = err.response && err.response.status >= 400 && err.response.status < 500
  if (!exErr) {
    console.log('Log Error: ', err)
    toast.error('Unexpected Error Occurred!')
  }
  return Promise.reject(err) 
})

const axiosInstance = axios.create({ baseURL: apiUrl })

function setJWT(jwt) {
  axiosInstance.defaults.headers.common['x-auth-token'] = jwt
}

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  setJWT
}