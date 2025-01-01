import { jwtDecode } from 'jwt-decode'
import http from './httpService'

const apiEndpoint = '/auth'
const tokenKey = 'token'

// When login, it will reload the page and this function will get call again.
http.setJWT(getJWT())

async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, {email, password})
  localStorage.setItem(tokenKey, jwt)
}

function logout() {
  localStorage.removeItem(tokenKey)
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey)
    return jwtDecode(jwt)
  } catch (ex) {
    return null
  }
}

function loginWithJWT(jwt) {
  localStorage.setItem(tokenKey, jwt)
}

function getJWT() {
  return localStorage.getItem(tokenKey)
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJWT,
  getJWT
}