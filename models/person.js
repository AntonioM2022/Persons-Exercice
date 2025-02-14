const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personsSchema = new mongoose.Schema({
      name: { 
        type: String,
        minLength: 3,
        required: true
      },
      number:{
        type: String,
        minLength:8,
        validate: {
          validator: function(v) {
            return /\d{1,2}-\d{5,}/.test(v);
          }
        },
        required: true
      } 
    })

personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personsSchema)