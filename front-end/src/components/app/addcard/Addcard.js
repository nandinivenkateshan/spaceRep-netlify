import React from 'react'
import './addcard.css'
import NavBar from '../navbar/Navbar'
import AddCardForm from './AddCardForm'

function Addcard () {
  return (
    <main>
      <NavBar />
      <AddCardForm heading='Add Card' />
    </main>
  )
}

export default Addcard
