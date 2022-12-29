import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Sightings({user}) {
    const [location, setLocation] = useState(user.defaultLocation)
    const [sightings, setSightings] = useState([])

    useEffect(getNotableSightings, [location])

    function getNotableSightings() {
        fetch('http://localhost:5000/api/bird/notableSightings/'+location)
        .then(res => res.json())
        .then((res) => {
            console.log(res)
            setSightings(res)
        })
        }
    function searchLink(com, sci) {
        // regex to select only characters inside parentheses
        return (<Link to={'/search/'+encodeURIComponent(sci)}>{com + ' (' + sci+')'}</Link>)
}
        return (
            <div className="sightings">
                <h1>Recent Notable Sightings for {location}</h1>
                <div className="sightings-list">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Count</th>
                            <th>Date/Time</th>
                        </tr>
                        {sightings.map((sighting) => (
                            <tr className="sighting-preview" key={sighting.subId}>
                                <td>{searchLink(sighting.comName, sighting.sciName)}</td>
                                <td>{sighting.locName}</td>
                                <td>{sighting.howMany}</td>
                                <td>{sighting.obsDt}</td>
                            </tr>
                         )
                        )}
                        
                    </table>
                    
                </div>
            </div>
                            


        )
    }




export default Sightings