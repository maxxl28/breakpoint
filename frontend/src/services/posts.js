import axios from 'axios'
const baseUrl='http://localhost:3001/api'

const getAllApps = () => {
  const request = axios.get(`${baseUrl}/apps`)
  return request.then(response => response.data)
}

const getAllIssues = () => {
  const request = axios.get(`${baseUrl}/issues`)
  return request.then(response => response.data)
}

const getApp = (id) => {
  const request = axios.get(`${baseUrl}/apps/${id}`)
  return request.then(response => response.data)
}

const postApp = newObject => {
  const user = JSON.parse(localStorage.getItem('breakpointUser'))
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  }
  const request = axios.post(`${baseUrl}/apps`, newObject, config)
  return request.then(response => response.data)
}

const postIssue = newObject => {
  const user = JSON.parse(localStorage.getItem('breakpointUser'))
  console.log("i run!")
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  }
  const request = axios.post(`${baseUrl}/issues`, newObject, config)
  console.log("testing")
  console.log(newObject)
  console.log(config)
  return request.then(response => response.data)
}



export default {
  getAllApps: getAllApps,
  getAllIssues: getAllIssues,
  getApp: getApp,
  postApp: postApp,
  postIssue: postIssue
}
