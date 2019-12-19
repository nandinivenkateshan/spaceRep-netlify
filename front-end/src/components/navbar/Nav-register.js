import React, { useEffect, useState } from 'react'
import logo from '../img/logo.jpeg'
import './nav.css'
import url from '../Config'
import { Link } from 'react-router-dom'

function Navbar (props) {
  const [isLoggedIn, setIsLogged] = useState(false)
  const sid = JSON.parse(window.localStorage.getItem('session'))
  console.log(sid)
  useEffect(() => {
    async function getDataFromDb () {
      let data = await window.fetch(`${url}/account/?sid=${sid}`)
      data = await data.json()
      if (data.user) setIsLogged(data.user)
    }
    getDataFromDb()
  }, [])
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
          {!isLoggedIn &&
            <Link to='/login' className={login}> {login}</Link>}
          {isLoggedIn &&
            <Link to='/loggedIn' className={login}> {login}</Link>}
        </aside>
      </nav>
    </main>
  )
}

export default Navbar
