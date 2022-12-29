import React, {Component, useState} from 'react'

function BirdResults(props) {
    const bird = props.bird
// {commonName, sciName}, 
    return (
        <div>
            Bird results:
            {JSON.stringify(bird, null, 2)}
        </div>
    )
}

export default BirdResults