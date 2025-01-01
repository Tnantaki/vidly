import http from './httpService'

const apiEndpoint = '/users'

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    name: user.name,
    password: user.password
  })
} 