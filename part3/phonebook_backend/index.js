require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    // Check if person with same name already exists
    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                // If person exists, update their phone number
                const updatedPerson = {
                    name: body.name,
                    number: body.number
                }

                return Person.findByIdAndUpdate(existingPerson._id, updatedPerson, { new: true })
                    .then(result => {
                        response.json(result)
                    })
                    .catch(error => {
                        console.log(error)
                        response.status(500).json({ error: 'failed to update person' })
                    })
            }

            // If person doesn't exist, create new one
            const person = new Person({
                name: body.name,
                number: body.number
            })

            person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
                .catch(error => {
                    console.log(error)
                    response.status(500).json({ error: 'failed to save person' })
                })
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({ error: 'database error' })
        })
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (request, response) => {
    const requestTime = new Date()

    Person.countDocuments({})
        .then(count => {
            const html = `
                <div>
                    <p>Phonebook has info for ${count} persons</p>
                    <p>${requestTime}</p>
                </div>
            `
            response.send(html)
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({ error: 'database error' })
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})