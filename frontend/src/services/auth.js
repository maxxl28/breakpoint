// service layer for authentication calls

import axios from 'axios'
const baseUrl='/api'

const postRegistration = (newUser) => {
  const request = axios.post(`${baseUrl}/register`, newUser)
  return request.then(response => response.data)
}

const postVerification = (payload) => {
  const request = axios.post(`${baseUrl}/verify`, payload)
  return request.then(response => response.data)
}

const postLogin = (user) => {
  const request = axios.post(`${baseUrl}/login`, user)
  return request.then(response => response.data)
}

export default {
  postRegistration: postRegistration,
  postVerification: postVerification,
  postLogin: postLogin
}

