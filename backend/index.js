// Server file that handles all api routes and MailerSend for email notifications
// Handles user auth, and CRUD operations for App, Issue

require('dotenv').config()
const nodemailer = require('nodemailer')
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

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

// Middleware: validate JWT and attach a user to request

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
app.use(express.static('dist'))
// Public Routes

// Get all issues
app.get('/api/issues', (request, response) => {
  IssueModel.find({}).then(result => {
    response.json(result)
  })
})
  
// Get all apps
app.get('/api/apps', (request, response) => {
  AppModel.find({}).then(result => {
    response.json(result)
  })
})

// Get app by id
app.get('/api/apps/:id', (request, response) => {
  const id = request.params.id
  AppModel.findById(id).then(app => {
    response.json(app)
  })
})

// Protected Routes (require authentication)

// Create app
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


app.post('/api/issues', authenticateToken, (request, response) => {
  console.log("api/issues called")
  const body = request.body
  const issue = new IssueModel({
    appId: body.appId,
    comment: body.comment
  })
  issue.save()
    .then((savedIssue) => {
      AppModel.findById(body.appId)
        .then(app => {
          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: app.email,
            subject: 'New issue reported on your Breakpoint app!',
            text: `Someone reported a new issue on "${app.name}"`
          }
          transporter.sendMail(mailOptions)
            .then(() => {
              console.log("EMAIL SENT")
              response.json(savedIssue)
            })
            .catch(emailError => {
              console.log(emailError)
              response.json(savedIssue) // Still return issue even if email fails
            })
        })
    })
    .catch(error => {
      console.log(error)
      response.status(500).json({ error: error })
    })
})

// Delete issue 
app.delete('/api/issues/:id', authenticateToken, async (request, response) => {
  const id = request.params.id
  const userEmail = request.user.email

  const issue = await IssueModel.findById(id)
  const app = await AppModel.findById(issue.appId)
  if (app.email != userEmail) {
    return response.status(403).json({ error: 'Can only resolve issues for your own app' })
  }

  await IssueModel.findByIdAndDelete(id)
    response.json({message: 'Issue resolved'})
})

// Authenticate User Routes

// Register User
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
  user.save().then(() => {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your Breakpoint account',
      text: `Your verification code is ${verificationToken}`
    }
    transporter.sendMail(mailOptions)
      .then(() => {
        console.log("EMAIL SENT")
        response.json({ message: 'Registration successful! Check your email.' })
      })
  })
  .catch(error => {
    console.log(error)
    response.status(500).json({ error: error })
  })
})
  
// Verify Token
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

// User login 
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

// start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})