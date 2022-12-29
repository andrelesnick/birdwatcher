import React, { useState, useEffect } from 'react'
import './Observation.css'
import { Link } from 'react-router-dom';


function ObservationData({user,observations}) {

    const [observationData, setObservationData] = useState(null)
    // const [sort, setSort] = useState("Latest")

    useEffect(getObservationData, [observations])

    function getObservationData() {
        // get observation data from backend
        // return observation data

        // if # of observations is 0, then retrieve information from backend, otherwise use existing observations
        if (observations === undefined) {
            console.log("No observations specified, so retrieving from backend")
            
            const parameters = "?email="+encodeURIComponent(user.email)+"&token="+encodeURIComponent(user.token)
            fetch('http://localhost:5000/api/auth/observations'+parameters)
            .then(res => res.json())
            .then((result) => {
                console.log("Observation data observations:")
                console.log(result.observations)
                setObservationData(result.observations)
            })
            .catch((error) => {
                console.log("Error:"+error)
                setObservationData(null)
            })
        }
    else {
        console.log("Observations specified, so using those")
        setObservationData(observations)
    }

}
    function searchLink(species) {
        // regex to select only characters inside parentheses
        const regex = /\(([^)]+)\)/;
        const match = regex.exec(species)
        const speciesCode = match[1]
        console.log(speciesCode)
        return (<Link to={'/search/'+encodeURIComponent(speciesCode)}>{species}</Link>)
}
    const displayObservations = () => {
        if (observationData == null) {
            return <tr> Loading data . . . </tr>
        }
        else {
            return observationData.map((observation) => (
                <tr className="observation cell" key={observation.id}>
                    <td>{searchLink(observation.name)}</td>
                    <td>{observation.location}</td>
                    <td>{observation.time}</td>
                    <td>{observation.date}</td>
                    <td className="notes">{observation.notes}</td>
                </tr>
            ))
            }
        }

    const options = ['Latest', 'Oldest', 'Location', 'Species'];
    const onOptionChangeHandler = (event) => {
        const sort = event.target.value === undefined ? 'Latest' : event.target.value;
        console.log("sorting by", sort)
        let sorted = [...observationData]
        sorted.sort(function(a,b){
        if (sort === 'Latest') {
            console.log('latesttt')
            return new Date(b.date) - new Date(a.date);
        }
        else if (sort === 'Oldest') {
            return new Date(a.date) - new Date(b.date);
        }
        else if (sort === 'Location') {
            if (a.location < b.location) {return -1;}
            if (a.location > b.location) {return 1;}
            return 0;
        }
        else if (sort === 'Species') {
            if (a.name < b.name) {return -1;}
            if (a.name > b.name) {return 1;}
            return 0;
        }
        });
        setObservationData(sorted)
        console.log(sorted)
    }


    return (
        <div>

            <h1>Observation Data</h1>

            <div>
                <label>Sort by: </label>
                <select onChange={onOptionChangeHandler}>
                {options.map((option, index) => {
                    return <option key={index} >
                        {option}
                        </option>
                        })}
                </select>
            </div>


            <table id="observations">
                <tr className="observation header">
                    <th>Species</th>
                    <th>Location</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Notes</th>
                </tr>
                {displayObservations()}
            </table>
        </div>
    )
}



export default ObservationData
