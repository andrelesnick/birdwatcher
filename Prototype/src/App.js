
import './App.css';
import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom/client';

// import components
import BirdResults from './components/BirdResults'


function App() {
  const [birdInput, setBirdInput] = useState('')
  const [birdOutput, setBirdOutput] = useState("nothing so far")

  // const root = ReactDOM.createRoot(document.getElementById('root'));

useEffect(() => {
  console.log("birdOutput changed: ", birdOutput)
}, [birdOutput])

  function handleChange(event) {
    setBirdInput(event.target.value)
  }
  function handleSubmit(event) {
    event.preventDefault()
    console.log("Bird looked up: " + birdInput)
    fetch("http://127.0.0.1:5000/api/bird/search/"+encodeURIComponent(birdInput))
    .then((response) => response.json())
    .then((data) => {
      setBirdOutput(data)
      console.log("data: ",data)
    })
  }
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
         Bird:
        <input type="text" 
        name="birdForm" 
        placeholder="Search for a bird here"
        value={birdInput} 
        onChange={handleChange}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      <BirdResults bird={birdOutput}></BirdResults>
    </div>
  );
}

export default App;
