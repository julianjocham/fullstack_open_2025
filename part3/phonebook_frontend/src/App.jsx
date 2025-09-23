import {useEffect, useState} from 'react'
import Notification from './components/Notification'
import bookService from './services/book'

const Person = (props) => {
    return <p>{props.name} {props.number}</p>
}

const Input = ({ label, value, onChange, type = "text", placeholder }) => {
    return (
        <div>
            {label}: <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
        </div>
    )
}

const PeopleList = ({ persons, onDelete }) => {
    return (
        <div>
            {persons.map((person) => {
                return (
                    <div key={person.name}>
                        <Person name={person.name} number={person.number} />
                        <button onClick={() => onDelete(person)}>delete</button>
                    </div>)
            })}
        </div>
    )
}


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState({ message: null, type: 'error' })

    useEffect(() => {
        bookService.getAll().then((initialPersons) => {
            setPersons(initialPersons)
        })
    }, [])

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification({ message: null, type: 'error' })
        }, 5000)
    }

    const handleAddPerson = (event) => {
        event.preventDefault()

        if (newName.trim() === '') {
            return
        }

        const existingPerson = persons.find((person) => person.name === newName)

        if (existingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const updatedPerson = { ...existingPerson, number: newNumber }

                bookService.update(existingPerson.id, updatedPerson)
                    .then((returnedPerson) => {
                        setPersons(persons.map(person =>
                            person.id !== existingPerson.id ? person : returnedPerson
                        ))
                        setNewNumber('')
                        setNewName('')
                        showNotification(`Updated ${returnedPerson.name}'s number`, 'success')
                    })
                    .catch(error => {
                        showNotification(`Error updating ${newName}: ${error.message}`, 'error')
                    })
            }
            return
        }

        const newPerson = {
            name: newName,
            number: newNumber,
        }

        bookService.create(newPerson).then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson))
            setNewNumber('')
            setNewName('')
            showNotification(`Added ${returnedPerson.name}`, 'success')
        })
            .catch(error => {
                showNotification(`Error adding ${newName}: ${error.message}`, 'error')
            })
    }


    const handleDeletePerson = (person) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            bookService.remove(person.id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== person.id))
                    showNotification(`Deleted ${person.name}`, 'success')
                })
                .catch(error => {
                    showNotification(`Information of ${person.name}: ${error.message} has already been removed from server`, 'error')
                })
        }
    }

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification.message} type={notification.type} />

            <Input
                label="filter shown with"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search names..."
            />

            <form onSubmit={handleAddPerson}>
                <Input
                    label="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                    label="number"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                />
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h1>Numbers</h1>
            <PeopleList persons={filteredPersons} onDelete={handleDeletePerson} />
        </div>
    )
}


export default App