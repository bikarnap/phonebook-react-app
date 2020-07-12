import React from 'react'

const Person = (props) => {
    const { name, number, deletePerson } = props
    return(
        <div>
            {name} {number}
            <button onClick={deletePerson}>delete</button>
        </div>
    )
}

export default Person