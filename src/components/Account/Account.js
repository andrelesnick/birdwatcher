import React, {useState} from 'react';
import './Account.css'

function Account({handler}) {
    const [user, setUser] = handler

const [form, setForm] = useState({
    name: '',
    email: '',
    defaultLocation: "",
    token: user.token
})
const [success,setSuccess] = useState('')

// [name] = value is shorthand for form[name] = value
const handleFormChange = (event) => {
    let { name, value } = event.target;
    // if (value.length === 0) {
    //     value = user[name]
    // }
    setForm({ ...form, [name]: value })
  };
  
function updateInfo() {
    fetch("http://localhost:5000/api/auth/update", {
        headers: {
            'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(form)
            })
            .then(res => res.json())
            .then((res) => {
            console.log(res)
            setUser(form)
        })
    }
// takes form data and updates information in backend
function handleSubmit(event) {
    event.preventDefault()
    
    // if any fields are empty, replace with current user info
    Object.keys(form).forEach(key => {
        if (form[key] === '') {
            form[key] = user[key]
        }
    })
    console.log("Updating details to:")
    console.log(form)
    updateInfo()
    setSuccess('Account details changed successfully!')
    
}


    return (
        <div id="form-container">
            <form onSubmit={handleSubmit}>
                    
                    <div class="form-group">

                        <label>Name: </label>
                        <input type="text" placeholder={user.name} class="form-control" id="name" name="name" value={form.name} onChange={handleFormChange}/>

                    </div>
                    <div class="form-group">

                        <label>Email: </label>
                        <input type="email" placeholder={user.email} class="form-control" id="email" name="email" readOnly={true}/>

                    </div>
                    <div class="form-group">

                        <label>Default Location: </label>
                        <input type="text" placeholder={user.defaultLocation} class="form-control" name="defaultLocation" id="defaultLocation" value={form.defaultLocation} onChange={handleFormChange}/>

                    </div>
                    {/* <div class="form-group">

                        <label for=pass>Password</label>
                        <input type="password" class="form-control" id="pass"/>

                    </div>
                    <div class="form-group ">

                        <label for=birthday>Birthday</label>
                        <input type="date" class="form-control" id="birthday"/>

                    </div> */}
                    
                    <div class="row mt-5">
                    
                    </div>
                    <input type="submit" value="Submit" />
                </form>
                <p style={{color:'green'}}> {success} </p>
        </div>
    )
}

export default Account