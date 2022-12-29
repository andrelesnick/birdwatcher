import React, {useState } from 'react';
import ObservationData from './ObservationData';
import './Observation.css'
import uniqid from 'uniqid';
import { Navigate } from 'react-router';

// here you can record bird observations 

function Observation({user}) {

    const [observationDetails, setObservationDetails] = useState(getDefaultValues())
    const [observations, setObservations] = useState([])
    // const [birdName, setBirdName] = useState("")



    function getDefaultValues() {
        const date = new Date();
        return {
            name: "",
            location: user.defaultLocation,
            time: date.toLocaleTimeString("en-gb", {hour: '2-digit', minute:'2-digit'}),
            date: date.toLocaleString().split(',')[0],
            notes: "",
            id: uniqid()
        }
    }

    function addObservation() {
        for (const key in observationDetails) {
            if (observationDetails[key] === "" && key !== "notes") {
                alert("Missing required fields")
                return
            }
        }
        

        // send observation to backend and get data on specific bird
        // user types in either a common name, scientific name, or eBird species code, and the backend returns both the exact scientific name and common name
        const data = {
            email: user.email,
            token: user.token,
            observation: observationDetails
        }
        fetch('http://localhost:5000/api/auth/observations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then((res) => {
            console.log('observation sent to backend')
            // setBirdName(res.name)
            console.log('bird name: '+res.name)
            let newObservationDetails = {...observationDetails, name: res.name}

            console.log('updating list of observations')
             // set values in frontend
            setObservations([...observations, newObservationDetails])
            setObservationDetails(getDefaultValues())
        })

       
        
    }

    const options = ['Latest', 'Oldest', 'Location', 'Species'];
    const onOptionChangeHandler = (event) => {
        const sort = event.target.value
        console.log("sorting by", sort)
    }

    return (
        <div>
            {/* <div>
            <select onChange={onOptionChangeHandler}>
             {options.map((option, index) => {
                return <option key={index} >
                    {option}
                    </option>
                    })}
             </select>
        </div>     */}


            <form id="form-container">
                <label>Species:</label>
                <input type="text" name="name" value={observationDetails.name} onChange={(e) => setObservationDetails({...observationDetails, name: e.target.value})} />
                <label>Location:</label>
                <input type="text" name="location" value={observationDetails.location} onChange={(e) => setObservationDetails({...observationDetails, location: e.target.value})} />
                <label>Time:</label>
                <input type="text" name="time" value={observationDetails.time} onChange={(e) => setObservationDetails({...observationDetails, time: e.target.value})} />
                <label>Date:</label>
                <input type="text" name="date" value={observationDetails.date} onChange={(e) => setObservationDetails({...observationDetails, date: e.target.value})} />
                <label>Notes:</label>
                <input type="text" name="notes" value={observationDetails.notes} onChange={(e) => setObservationDetails({...observationDetails, notes: e.target.value})} />
                <button type="button" onClick={addObservation}>Add Observation</button>
            </form>

            <p> Observations for current session </p>

            <ObservationData user={user} observations={observations}/>
        </div>
    )
}

export default Observation;