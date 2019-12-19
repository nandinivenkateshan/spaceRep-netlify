import React from 'react'
import logo from '../img/logo.jpeg'
import './nav.css'
import { Link } from 'react-router-dom'

function Navbar (props) {
  const { signup, login } = props
  return (
    <main className='main'>
      <nav className='nav-bar'>
        <Link to='/' className='logos'>
          <label className='logo-text'>SpaceRep</label>
          <img src={logo} alt='logo' className='logo' />
        </Link>
        <aside className='btns'>
          <Link to='/signup' className={signup}>{signup} </Link>
          <Link to='/login' className={login}> {login}</Link>
        </aside>
      </nav>
    </main>
  )
}

export default Navbar
