import {useParams} from 'react-router-dom'
import {useState} from 'react'
import BirdResults from './BirdResults'

function BirdSearch({user}) {
    const {species} = useParams()
    const [speciesCurrent, setSpeciesCurrent] = useState(species === undefined ? '' : species)
    const [birdData, setBirdData] = useState({
        species: species === undefined ? '' : species,
        eBird: null,
        photos: [],
        recordings: []
    })

    function searchBird() {
        console.log("Searching for bird: " + species)
        fetch("http://localhost:5000/api/bird/search/allData/"+encodeURI(speciesCurrent)+'/'+user.email+'/'+user.token, {
            method: 'GET',
        })
        .then(res => res.json())
        .then((res) => {
            if (res.error) {
                console.log(res.error)
                return
            }
            console.log("bird info retrieved")
            console.log(res)
            setBirdData(res)
        })
        

    }

    return (
        <div>

            <form>
                <input type="text" name="species" placeholder="Enter species name" value={speciesCurrent} onChange={(e) => setSpeciesCurrent(e.target.value)}></input>
                <button type="Button" onClick={searchBird}>Search</button>
            </form>
        
            {birdData.eBird !== null ? <BirdResults birdData={birdData}/> : <div></div>}

        </div>
    )
}

export default BirdSearch