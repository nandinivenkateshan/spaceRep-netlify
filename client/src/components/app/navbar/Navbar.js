import React, { useState, useEffect } from 'react'
import './navbar.css'
import logo from '../../img/logo.jpeg'
import { Link } from 'react-router-dom'
import url from '../../config'

function Navbar () {
  const [account, setAccount] = useState('')
  const sid = JSON.parse(window.localStorage.getItem('session'))
  
  useEffect(() => {
    async function getDataFromDb () {
      let data = await window.fetch(`${url}/account/?sid=${sid}`)
      data = await data.json()
      if (data.user) setAccount(data.user)
    }
    getDataFromDb()
  }, [])

  return (
    <>
      <nav className='navbar'>
        <Link className='navbar-brand' to='/loggedIn'>
          <label className='logo-text'>SpaceRep</label>
          <img src={logo} alt='logo' className='logo' />
        </Link>

        <div className='navbar-menu-start'>
          <Link className='navbar-item' to='/decks'> Decks</Link>
          <Link className='navbar-item' to='/add'> Add</Link>
        </div>

        <div className='navbar-menu-end'>
          <Link className='navbar-item' to='/decks'>Account- {account}</Link>
          <Link className='navbar-item' to='/login'> Log Out</Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
