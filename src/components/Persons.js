import React from 'react'
import Person from './Person'

const Persons = ({ persons, deletePerson }) => {
    return(
        <div>
            {persons.map(person => 
                            <Person key={person.name}
                                name={person.name}
                                number={person.number}
                                deletePerson={()=>deletePerson(person.id)}
                                
                            />
                        )
            }
        </div>
    )
}

export default Persons