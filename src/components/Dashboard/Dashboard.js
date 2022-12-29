import React, {Component, useState, useEffect } from 'react';
import ObservationData from './ObservationData';
import Sightings from './Sightings';


function Dashboard({user}) {


return (
    <div>
        <ObservationData user={user}/>
        <Sightings user={user}></Sightings>
    </div>
)
}

export default Dashboard