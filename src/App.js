import React, { useState, useEffect }from 'react';
import './App.css';
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

function App() {
  const [ persons, setPersons ] = useState([
    // { name: 'Arto Hellas', number: '040-123456' },
    // { name: 'Ada Lovelace', number: '39-44-5323523' },
    // { name: 'Dan Abramov', number: '12-43-234345' },
    // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState(null)
  const [ isError, setIsError ] = useState(false)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => setPersons(initialPersons))
  }, [])
  const addPerson = event => {
    event.preventDefault()
    const personObject = {
      name: newName, 
      number: newNumber
    }
    const personExists = persons.find(person => person.name === personObject.name)
    if(personExists) {
      if(window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...personExists, number: personObject.number}
        personService
          .update(personExists.id, updatedPerson)
          .then(returnedPerson => {
            setIsError(false)
            setPersons(persons.map(person => person.id !== personExists.id ? person : returnedPerson))
            setNotification(`Updated ${personExists.name}'s number to ${newNumber}`)
          })
          .catch(error => {
            setIsError(true)
            setPersons(persons.filter(person => person.id !== personExists.id))
            setNotification(`Information of ${personExists.name} has already been removed from the server`)
          })
      }
    } else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setIsError(false)
            setPersons(persons.concat(returnedPerson))
            setNotification(`Added ${personObject.name}`)
          })
          .catch(error => {
            setIsError(true)
            //setPersons(persons)
            console.log(error.response)
            setNotification(error.response.data.error)
          })
    }
    setNewName('')
    setNewNumber('')

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setFilter(event.target.value)
  const handleDeletePerson = id => {
    const person = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setIsError(false)
          setNotification(`Deleted ${person.name}`)
        })
        .catch(error => {
          setIsError(true)
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`Information of ${person.name} has already been removed from the server`)
        })
    }

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const personsToShow = persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification}
        isError={isError}
      />
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange} 
      />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={handleDeletePerson} />
    </div>
  );
}

export default App;
