// schema for apps

const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
  name: String, // App name
  description: String, // short description
  deployment: String, // url
  github: String, // repository
  email: String, // email for notifications
})

appSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('App', appSchema)