const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  verified: Boolean,
  verificationToken: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('User', userSchema)