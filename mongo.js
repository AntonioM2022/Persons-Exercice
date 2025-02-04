const mongoose = require('mongoose')


const password = process.argv[2]
const name= process.argv[3]
const phone= process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.2o5rn.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

  mongoose.set('strictQuery',false)

  mongoose.connect(url)

  const personsSchema = new mongoose.Schema({
      name: String,
      number: Number,
    })

    const Person = mongoose.model('Person', personsSchema)

if (process.argv.length==3) {
  Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}else{
    let person=new Person({
        name: name,
        number: phone
    })

    person.save().then(result=>{
        console.log(`added ${name} number ${phone} to phonebook`);
        
        mongoose.connection.close()
    })
}




 
    