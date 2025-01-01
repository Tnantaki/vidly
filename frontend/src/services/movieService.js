import http from './httpService'

const apiEndpoint = '/movies'

console.log('url movie: ', apiEndpoint)
const movieUrlById = (id) => `${apiEndpoint}/${id}`

export function getMovies() {
  return http.get(apiEndpoint)
}

export function getMovie(id) {
  return http.get(movieUrlById(id))
}

export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie }
    delete body._id
    return http.put(movieUrlById(movie._id), body)
  }

  return http.post(apiEndpoint, movie)
}

export function deleteMovie(id) {
  return http.delete(movieUrlById(id))
}