const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
  name: String,
  description: String,
  deployment: String,
  github: String,
  email: String,
})

appSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('App', appSchema)