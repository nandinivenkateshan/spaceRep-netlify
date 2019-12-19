import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NavBar from '../navbar/Navbar'
import styled from 'styled-components'
import url from '../../Config'

const Heading = styled.h1`
color: red;
font-size: 30px;
text-shadow: 1px 1px 1px grey;
margin-bottom: 20px;
text-align: center;
margin-left: 30px;
`
const Section = styled.section`
margin: 50px auto;
width: 400px;
display: grid;
`
const List = styled.li`
list-style-type: none;
margin-bottom: 20px;
display: grid;
grid-template-columns: 1fr 1fr;
padding: 10px;
grid-gap: 100px;
border-bottom: 1px solid yellow;
`

const EachDeck = styled.label`
text-decoration: none;
cursor: pointer;
color: rgb(44, 44, 40); 
text-shadow: 0px 0px 1px red;
`
const DropDownElement = styled.div`
display: flex;
position: relative;
color: rgb(44, 44, 40); 
text-shadow: 0px 0px 1px red;
padding: 10px;
&:hover{
  color: green;
  cursor: pointer;
  background-color: rgb(207, 158, 158);
}
`

const DropDownContent = styled.div`
background-color: rgb(219, 189, 189);
position:absolute;
display: none;
z-index: 1;
box-shadow: 2px 2px 2px grey;
`

const DropDownBox = styled.div`
max-width: 70px;
position: relative;
justify-self: end;
&:hover ${DropDownContent} {
  display: block;
}
`
const DropDownBtn = styled(EachDeck)``

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
      <Section>
        <Heading>Decks</Heading>
        <ul>
          {decks.map(item => {
            return (
              <List key={item.id}>
                <EachDeck
                  onClick={(e) => handleTotalDeck(e)}
                >
                  {item.deck.toUpperCase()}
                </EachDeck>
                <DropDownBox>
                  <DropDownBtn>ACTION</DropDownBtn>
                  <DropDownContent>
                    <DropDownElement onClick={() => handleRename(item.deck)}>Rename</DropDownElement>
                    <DropDownElement onClick={() => handleDeleteDeck(item.deck)}>Delete</DropDownElement>
                  </DropDownContent>
                </DropDownBox>
                {isClick && <Redirect to={`/decks/${path}`} />}
              </List>
            )
          })}
        </ul>
      </Section>
    </main>
  )
}

export default Decks
