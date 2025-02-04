const express = require('express')
const app = express()
const cors= require('cors')
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
require('dotenv').config()
const Person = require('./models/person')
//const person = require('./models/person')


//aqui es como si crearamos una variable para ponerla en el formato de abajo, se crea la variable body que lo que tiene es la
//info del body en la peticion
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons= [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response)=>{
  Person.find({}).then(persons=>{
    response.json(persons)
  })
})

app.get('/info',(request, response)=>{
    const entrances= persons.length
    console.log(entrances)
    const options = {
        timeZone: 'Europe/Kiev', 
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long',
    };
    var f= new Date()
    const time= f.toLocaleString('en-US', options)
    console.log(time);
    response.send(`<p>Phonebook has info for ${entrances} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response, next)=>{
    Person.findById(request.params.id)
    .then(person=>{
      if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
    })
    .catch(error=> next(error))
})

app.delete('/api/persons/:id', (request, response, next)=>{
    Person.findByIdAndDelete(request.params.id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error=> next(error))
})

app.post('/api/persons',(request, response, next)=>{
    const body= request.body
    
    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number misssing'
        })
      }else{
        const newPerson= new Person({
            name: body.name,
            number: body.number
        })
        newPerson.save()
        .then(savedPerson=>{
          response.json(savedPerson)
        })
        .catch(error=> next(error))
      }
    
})

app.put('/api/persons/:id', (request, response, next)=>{
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query', validate: 'validator'})
  .then(updatedPerson=>{
    response.json(updatedPerson)
  })
  .catch(error=> next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})