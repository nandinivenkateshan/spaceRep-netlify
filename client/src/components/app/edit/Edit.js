import React, { useState, useEffect } from 'react'
import Form from '../addcard/AddCardForm'
import NavBar from '../navbar/Navbar'
import { useParams } from 'react-router-dom'
import url from '../../config'

function Edit () {
  const { id } = useParams()
  const [editCard, setEditCard] = useState('')
  const sid = JSON.parse(window.localStorage.getItem('session'))

  async function getDataFromDb () {
    const res = await window.fetch(`${url}/cards/?sid=${sid}`)
    const data = await res.json()
    const card = data.filter(item => item.id === Number(id))
    setEditCard(card)
  }

  useEffect(() => {
    getDataFromDb()
  }, [])

  return (
    <main>
      <NavBar />
      {editCard &&
        <Form heading='Edit card' id={id} editCard={editCard} />}
    </main>
  )
}

export default Edit
