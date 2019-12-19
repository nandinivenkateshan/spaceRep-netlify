import React, { useState, useEffect } from 'react'
import styles from './Navbar.module.css'
import logo from '../../img/logo.jpeg'
import { Link } from 'react-router-dom'
import url from '../../Config'

function Navbar () {
  const [account, setIsAccount] = useState('')
  const sid = JSON.parse(window.localStorage.getItem('session'))
  useEffect(() => {
    async function getDataFromDb () {
      let data = await window.fetch(`${url}/account/?sid=${sid}`)
      data = await data.json()
      if (data.user) setIsAccount(data.user)
    }
    getDataFromDb()
  }, [])

  return (
    <>
    {console.log('nav', styles)}
      <nav className={styles.navbar}>
        <Link className={styles.navbarBrand} to='/loggedIn'>
          <label className={styles.logoText}>SpaceRep</label>
          <img src={logo} alt='logo' className='logo' />
        </Link>

        <div className={styles.navbarMenuStart}>
          <Link className={styles.navbarItem} to='/decks'> Decks</Link>
          <Link className={styles.navbarItem} to='/add'> Add</Link>
        </div>

        <div className={styles.navbarMenuEnd}>
          <Link className={styles.navbarItem} to='/loggedIn'>Account- {account}</Link>
          <Link className={styles.navbarItem} to='/loggedout'> Log Out</Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
