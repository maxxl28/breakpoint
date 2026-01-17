require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGO_URI
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const appSchema = new mongoose.Schema({
  name: String,
  description: String,
  deployment: String,
  github: String,
  email: String,
})

const issueSchema = new mongoose.Schema({
  appId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'App'
  },
  comment: String,
})

const App = mongoose.model('App', appSchema)
const Issue = mongoose.model('Issue', issueSchema)

App.find({}).then(result => {
  result.forEach(app => {
    console.log(app)
  })
  mongoose.connection.close()
})
/*
const app = new App({
  name: "Cs10",
  description: "A place to do.",
  deployment: "https://a12.com",
  github: "github.com",
  email: "person@com"
})

app.save().then(savedApp => {
  const issue = new Issue({
    appId: savedApp._id,
    comment: "Login button not working"
  })
  return issue.save()
}).then(result => {
  console.log('test issue and test app saved!')
  mongoose.connection.close()
})*/