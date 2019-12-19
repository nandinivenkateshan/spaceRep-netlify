import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../navbar/Navbar'
import './decks.css'
import url from '../../Config'

function Decks () {
  const [decks, setDecks] = useState([])
  const [isClick, setIsClick] = useState(false)
  const [path, setPath] = useState('')
  const [isAction, setAction] = useState(false)
  const sid = JSON.parse(window.localStorage.getItem('session'))

  useEffect(() => {
    async function getDataFromDb () {
      let data = await window.fetch(`${url}/deckNames/?sid=${sid}`)
      data = await data.json()
      setDecks(data)
      setAction(false)
    }
    getDataFromDb()
  }, [isAction])

  const modifyDeckClickTime = async (url, data) => {
    const sessionId = JSON.parse(window.localStorage.getItem('session'))
    const value = { ...data, sessionId }
    const res = await window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) setIsClick(true)
  }

  const modifyDeckName = async (url, data) => {
    const sessionId = JSON.parse(window.localStorage.getItem('session'))
    const value = { ...data, sessionId }
    setAction(true)
    await window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  function handleTotalDeck (e) {
    const deck = e.target.innerText.toLowerCase()
    setPath(deck)
    const deckClickTime = parseInt(Date.now() / 1000)
    modifyDeckClickTime(`${url}/updateDeckClickTime`, { deck, deckClickTime })
  }

  function handleRename (deckName) {
    const reName = window.prompt('Enter New Name')
    if (reName) modifyDeckName(`${url}/modifyDeckName`, { reName, deckName })
  }

  async function deleteDeck (url, data) {
    const sessionId = JSON.parse(window.localStorage.getItem('session'))
    const value = { ...data, sessionId }
    setAction(true)
    await window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  function handleDeleteDeck (deckName) {
    const result = window.confirm('Are You Sure to Delete? This Can\'t be undone.')
    if (result) {
      deleteDeck(`${url}/deleteDeck`, { deckName })
    }
  }

  return (
    <main>
      <NavBar />
      <section className='decks'>
        <h1 className='decks-heading'>Decks</h1>
        <ul>
          {decks.map(item => {
            return (
              <li key={item.id} className='list'>
                <label
                  onClick={(e) => handleTotalDeck(e)} className='deck'
                >
                  {item.deck.toUpperCase()}
                </label>
                <div className='dropdown-box'>
                  <label className='dropdown-btn'>ACTION</label>
                  <div className='dropdown-content'>
                    <label onClick={() => handleRename(item.deck)}>Rename</label>
                    <label onClick={() => handleDeleteDeck(item.deck)}>Delete</label>
                  </div>
                </div>
                {isClick && <Redirect to={`/decks/${path}`} />}
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

export default Decks
