// schema for issues

const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  appId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'App'
  }, // reference to app
  comment: String, // bug report text
})

issueSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Issue', issueSchema)