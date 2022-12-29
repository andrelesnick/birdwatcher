import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Header.css'
import logo from '../../images/logo.png'

function Header({user}) {



    return (
        <div class="header">
            <img class="logo" src={logo} alt='login' />
            <div class="header-right">   
                    <Link to='/' >Home</Link>
                    <Link to='/anatomy' >Bird Anatomy</Link>
                    <Link to='/search' >Bird Lookup</Link>
                    <Link to='/account' >Account</Link>
                    <Link to='/dashboard'>Dashboard</Link>
                    {/* <Link to='/about'>About Us</Link> */}
                    <Link to='/observation'>Record Observation</Link>
                    {user == null ? <Link to='/login'>Login</Link> : <Link to='/logout'>Logout</Link>}
            </div>
            
        </div>

    )
}

export default Header