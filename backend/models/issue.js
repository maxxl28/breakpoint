const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  appId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'App'
  },
  comment: String,
})

issueSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Issue', issueSchema)