import { useState, useEffect } from 'react'
import personService from './services/persons.js'
import Notification from "./Components/Notification";
import Persons from './Components/Persons';
import PersonForm from './Components/PersonForm';
import Filter from './Components/Filter';


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(data =>
                setPersons(data))
    }, [])



    const addPerson = (event)=>{
        event.preventDefault()

        const exestingPerson = persons.find(person => person.name === newName);
        if (exestingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const updatedPerson = {...exestingPerson, number: newNumber  }

                personService.update(exestingPerson.id, updatedPerson)
                    .then(responsePerson => {
                        console.log(`${JSON.stringify(responsePerson.name)} was updated` )
                        setPersons(persons.map(person => person.id !== exestingPerson.id ?
                            person : responsePerson));
                        setNewName('');
                        setNewNumber('');
                        setMessage(`Added ${updatedPerson.name}`)
                        setTimeout(() =>  {
                            setMessage(null)
                        }, 5000)
                    })
                    .catch(error => {
                        setMessage(
                            `Information of ${updatedPerson.name} has already removed from server`
                        )
                        setTimeout( () => {
                            setMessage(null)
                        }, 5000)

                        setPersons(persons.filter(person => person.id !== exestingPerson.id))
                        console.log(error.response.data)
                    })

            }
        }
        else
        {
            const newPerson ={
                name: newName,
                number: newNumber,
            }


            personService
                .create(newPerson)
                .then(returnedPerson =>
                    {
                        console.log(`${JSON.stringify(returnedPerson.name)} added`)
                        setPersons(persons.concat(returnedPerson))
                        setNewName('')
                        setNewNumber('')
                        setMessage(`Added ${newPerson.name}`)
                        setTimeout(() =>  {
                            setMessage(null)
                        }, 5000)
                    }
                )
                .catch(error => {
                    console.log(error.response.data.error)
                    setMessage(error.response.data.error)
                    setTimeout(() =>  {
                        setMessage(null)
                    }, 5000)
                })
        }
    }


    const deletePerson = (id, personName)=> {
        if (window.confirm(`Delete ${personName} ?`)){

            personService.remove(id)
                .then(()=>{
                    setPersons(persons.filter(person => person.id !== id))
                    console.log(`${personName} was deleted`)
                })
                .catch(error => {
                    console.log(error.response.data)
                    setMessage(
                        `Information of ${personName} was already removed from server`
                    )
                    setTimeout( () => {
                        setMessage(null)
                    }, 5000)

                    setPersons(persons.filter(person => person.id !== id))
                })
        }
    }


    const handleNameChange =(event)=> {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event)=> {
        setNewNumber((event.target.value))
    }

    const handleSearchChange = (event)=> {
        setSearchTerm(event.target.value)
    }


    const filteredPersons = searchTerm ? persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())) : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message}/>

            <Filter handleSearchChange={handleSearchChange} searchTerm={searchTerm} />

            <h2>add a new</h2>

            <PersonForm addPerson={addPerson} handleNameChange={handleNameChange}
                        handleNumberChange={handleNumberChange} newName={newName}
                        newNumber={newNumber} />

            <h2>Numbers</h2>
            <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
        </div>
    )
}

export default App
