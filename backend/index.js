require('dotenv').config()
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const crypto = require('crypto')
const express = require('express')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const url = process.env.MONGO_URI
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const AppModel = require('./models/app')
const IssueModel = require('./models/issue')
const UserModel = require('./models/user')

// logs requests to console (from fullstackopen course)
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const authenticateToken = async (request, response, next) => {
  const token = getTokenFrom(request)
  if (!token) {
    return response.status(401).json({ error: 'Token missing' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'User no longer exists' })
    }

    request.user = user
    next()
  } catch (error) {
    return response.status(401).json({ error: 'Invalid token' })
  }
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)



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
  AppModel.findById(id).then(app => {
    response.json(app)
  })
})

// post app
app.post('/api/apps', authenticateToken, (request, response) => {
  
  const body = request.body
  const newApp = new AppModel({
    name: body.name,
    description: body.description,
    deployment: body.deployment,
    github: body.github,
    email: body.email
  })
  newApp.save().then((savedApp) => {
    response.json(savedApp)
  })
})

// postIssue
app.post('/api/issues', authenticateToken, (request, response) => {
  const body = request.body
  const issue = new IssueModel({
    appId: body.appId,
    comment: body.comment
  })
  console.log(issue)
  issue.save()
    .then((savedIssue) => {
      console.log("ISSUE SAVED TO DATABASE")
      console.log("ASFASF")
      AppModel.findById(body.appId)
        .then(app => {
          console.log("APP FOUND, SENDING EMAIL")
          console.log(app.email)
          const mailerSend = new MailerSend({
            apiKey: process.env.MAILERSEND_API_KEY
          })
          const sentFrom = new Sender("noreply@test-q3enl6k0ndm42vwr.mlsender.net", "breakpoint")
          const recipients = [new Recipient(app.email, "Developer")]
          
          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("Subject: new issue")
            .setText("Someone posted a new issue!")

          mailerSend.email.send(emailParams)
            .then(() => {
              console.log("EMAIL SENT SUCCESSFULLY")
              response.json(savedIssue)
            })
            .catch(emailError => {
              console.log("EMAIL SEND FAILED")
              console.error(emailError)
              response.json(savedIssue)
            })
        })
        .catch(appError => {
          console.log("APP NOT FOUND")
          console.error(appError)
          response.status(404).json({ error: 'App not found' })
        })
    })
    .catch(saveError => {
      console.log("ISSUE SAVE FAILED")
      console.error(saveError)
      response.status(500).json({ error: 'Failed to save issue' })
    })
})

// postUser
app.post('/api/register', async (request, response) => {  
  const body = request.body
  const name = body.name
  const email = body.email
  const password = body.password
  const userExists = await UserModel.findOne({email: email})  
  
  if (userExists) {
    return response.status(400).json({error: "user already exists"})
  }

  /* left out for testing purposes
  if (!email.endsWith("@dartmouth.edu")) {
    return response.status(400).json({error: "need dartmouth edu email"})
  }
  */
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const verificationToken = crypto.randomBytes(4).toString('hex')
  const user = new UserModel({
    name: name,
    email: email,
    passwordHash: passwordHash,
    verified: false,
    verificationToken: verificationToken,
  })
  console.log("NEW USER HAS BEEN CREATED, SENDING TO MONGO DB...")
  user.save().then(user => {
    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY
      })
    const sentFrom = new Sender("noreply@test-q3enl6k0ndm42vwr.mlsender.net", "breakpoint")
    const recipients = [
      new Recipient(email, "Developer")
    ]
    const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Subject: new token")
    .setText(`Your verification code is ${verificationToken}`)

    mailerSend.email.send(emailParams).then(email => {
      console.log("I RAN AND EMAIL ALERT SENT")
      response.json(email)
    })
    .catch(error => {
      response.status(500).json({error: error})
    })
  })
  .catch(error => {
    response.status(500).json({error: error})
  })
})
  
app.post('/api/verify', async (request, response) => {
  const body = request.body  
  const token = body.token
  const user = await UserModel.findOne({ verificationToken: token })
  if (!user) {
    return response.status(400).json({ error: 'Invalid verification token' })
  }
  if (user.verified) {
    return response.status(400).json({ error: 'User already verified' })
  }
  user.verified = true
  user.verificationToken = null 
  await user.save()
  response.json({ message: 'Account verified'})
})

app.post('/api/login', async (request, response) => {
  const body = request.body
  const email = body.email
  const user = await UserModel.findOne({ email: email})
  if (!user || !user.verified) {
    return response.status(400).json({ error: 'Invalid user'})
  }
  const password = body.password
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  
  if (!passwordCorrect) {
    return response.status(400).json({ error: 'Invalid credentials' })
  }
  const userForToken = {
    email: user.email,
    id: user._id
  }
  const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' })

  response.json({ 
    token: token,
    email: user.email,
    name: user.name
  })
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})