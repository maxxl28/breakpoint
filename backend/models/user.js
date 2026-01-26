// schema for users

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String, // User's name
  email: String, // Dartmouth address
  passwordHash: String, // hashed passwird
  verified: Boolean, // check verification
  verificationToken: String // Random token sent for verification
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('User', userSchema)