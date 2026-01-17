const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

let apps = [
    {
      "id": 1,
      "name": "App One",
      "description": "First test app",
      "deployment": "https://appone.com",
      "github": "https://github.com/user/appone",
      "email": "appone@example.com"
    },
    {
      "id": 2,
      "name": "App Two",
      "description": "Second test app",
      "deployment": "https://apptwo.com",
      "github": "https://github.com/user/apptwo",
      "email": "apptwo@example.com"
    },
    {
      "id": 58,
      "name": "Cs10",
      "description": "A place to do.",
      "deployment": "https://a12.com",
      "github": "github.com",
      "email": "person@com"
    },
    {
      "id": 622,
      "name": "Arsenal",
      "description": "second place",
      "deployment": "arsenal.com",
      "github": "github.com/arsenal",
      "email": "arsenal@goon.com"
    },
    {
      "id": 69,
      "name": "App12",
      "description": "A great computer",
      "deployment": "google.com",
      "github": "github.com",
      "email": "ma@a"
    }
  ]

let issues = [
    {
      "id": 1,
      "appId": 1,
      "comment": "Login button not working"
    },
    {
      "id": 2,
      "appId": 1,
      "comment": "UI breaks on mobile"
    },
    {
      "id": 3,
      "appId": 2,
      "comment": "Deployment link is down"
    },
    {
      "id": "8a17",
      "appId": 1,
      "comment": "Hi"
    }
  ]

// logs requests to console (from fullstackopen course)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
app.use(express.json())

// get all issues
app.get('/api/issues', (request, response) => {
  response.json(issues)
})

// get all apps
app.get('/api/apps', (request, response) => {
  response.json(apps)
})

// get app by id
app.get('/api/apps/:id', (request, response) => {
  const id = request.params.id
  const app = apps.find(app => app.id == id)
  response.json(app)
})

// post app
app.post('/api/apps', (request, response) => {
  const app = request.body
  const newApp = { ...app, id: Math.floor(Math.random() * 10000) }
  apps = apps.concat(newApp)
  response.json(newApp)
})

// postIssue
app.post('/api/issues', (request, response) => {
  const issue = request.body
  const newIssue = { ...issue, id: Math.floor(Math.random() * 10000) }
  issues = issues.concat(newIssue)
  response.json(newIssue)
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})