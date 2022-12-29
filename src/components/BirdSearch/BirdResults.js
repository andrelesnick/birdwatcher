import ReactAudioPlayer from "react-audio-player"

import './BirdResults.css'

function BirdResults({birdData}) {


    if (birdData.eBird === null) return (<div></div>)

    return (
        <div>
            <div id="bird-data">
                <table>
                    <tr>
                        <th>Common Name</th>
                        <th>Scientific Name</th>
                        <th>Order</th>
                        <th>Family</th>
                        <th>Extinct?</th>
                    </tr>
                    <tr>
                        <td>{birdData.eBird.COMMON_NAME}</td>
                        <td>{birdData.eBird.SCIENTIFIC_NAME}</td>
                        <td>{birdData.eBird.TAXON_ORDER}</td>
                        <td>{birdData.eBird.FAMILY_SCI_NAME}</td>
                        <td>{birdData.eBird.EXTINCT === true ? 'Yes' : 'No'}</td>
                    </tr>
                </table>
            </div>
            
            <div id="bird-images">
                <img src={birdData.photos[0]}></img>
                <img src={birdData.photos[1]}></img>
                <img src={birdData.photos[2]}></img>
            </div>
           <h1> Audio Recordings</h1>
            <div id="bird-recordings">
                {birdData.recordings.map((recording) => {
                    return (
                        <ReactAudioPlayer src={recording} controls/>
                    )
                })}
            </div>
            

        </div>
    )
}

export default BirdResults