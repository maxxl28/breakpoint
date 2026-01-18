require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const url = process.env.MONGO_URI
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const AppModel = require('./models/app')
const IssueModel = require('./models/issue')


// logs requests to console (from fullstackopen course)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(cors())
app.use(requestLogger)
app.use(express.json())

// get all issues
app.get('/api/issues', (request, response) => {
  IssueModel.find({}).then(result => {
      response.json(result)
    })
})
  

// get all apps
app.get('/api/apps', (request, response) => {
  AppModel.find({}).then(result => {
    response.json(result)
  })
})

// get app by id
app.get('/api/apps/:id', (request, response) => {
  const id = request.params.id
  AppModel.findById(id).then(note => {
    response.json(note)
  })
})


// post app
app.post('/api/apps', (request, response) => {
  const body = request.body
  const app = new AppModel({
    name: body.name,
    description: body.description,
    deployment: body.deployment,
    github: body.github,
    email: body.email
  })
  app.save().then((savedApp) => {
    response.json(savedApp)
  })
})

// postIssue
app.post('/api/issues', (request, response) => {
  const body= request.body
  const issue = new IssueModel({
    appId: body.appId,
    comment: body.comment
  })
  issue.save().then((savedIssue) => {
    response.json(savedIssue)
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})