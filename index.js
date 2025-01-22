const express = require('express')
const app = express()
const cors= require('cors')
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

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
    response.json(persons)
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

app.get('/api/persons/:id', (request, response)=>{
    const id= Number(request.params.id)
    const person= persons.find(p=>p.id===id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id= Number(request.params.id)
    persons= persons.filter(person=> person.id!==id)
    response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
    const body= request.body
    
    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number misssing'
        })
      }else{
        const newId= Math.floor(Math.random()*1000)
        const newPerson= {
            id: newId,
            name: body.name,
            number: body.number
        }
        persons.concat(newPerson)
        response.json(newPerson)
      }
    
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})