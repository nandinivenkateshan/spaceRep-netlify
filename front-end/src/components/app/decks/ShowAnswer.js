import React from 'react'
import parse from 'html-react-parser'
import url from '../../config'

function ShowAnswer ({ cards, onAgainAns, onEasyOrGood, onEdit }) {
  const sid = JSON.parse(window.localStorage.getItem('session'))

  function ConvertSec (n) {
    const time = []
    const day = parseInt(n / (24 * 3600))
    if (day) time.push(` ${day} d`)
    n = (n % (24 * 3600))
    const hour = parseInt(n / 3600)
    if (hour) time.push(` ${hour} hour`)
    n = parseInt(n % 3600)
    const min = parseInt(n / 60)
    if (min) time.push(` ${min} min`)
    n = parseInt(n % 60)
    const sec = n
    if (sec) time.push(sec + 'sec')
    return time
  }

  async function modifyTimeStamp (url, data) {
    const value = { ...data, sid }
    await window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
  }

  function handleAgain (array) {
    let { id, status, again, easy, good } = array
    status = 'learning'
    easy = 86400 // 1 day
    good = 259200 // 3 day

    const timeStamp = parseInt(Date.now() / 1000)
    modifyTimeStamp(`${url}/updateTimeStamp`,
      { id, again, easy, good, timeStamp, status }
    )
    onAgainAns({ type: 'againAnswer', newArr: [...cards.slice(1), cards[0]] })
  }

  function handleEasyOrGood (data, e) {
    const answerType = e.target.innerText.toLowerCase()
    let { id, status, easy, good, again } = data
    const timeToDelay = data[answerType]
    const oldStatus = status
    if (oldStatus === 'new') {
      status = 'learning'
      easy = 86400 // 1 day
      good = 259200 // 3 days
    }
    if (oldStatus === 'learning') {
      status = 'review'
      easy = 172800 // 2 days
      good = 345600 // 4 days
    }
    if (oldStatus === 'review') {
      easy = Number(easy) + 172800
      good = Number(good) + 345600
    }

    const timeStamp = parseInt(Date.now() / 1000) + Number(timeToDelay)
    modifyTimeStamp(`${url}/updateTimeStamp`,
      { id, easy, good, again, timeStamp, status }
    )
    onEasyOrGood({ type: `${answerType}Answer`, newArr: cards.slice(1) })
  }

  function handleEdit (id) {
    onEdit(id)
  }

  return (
    <section>
      <div className='showAnswer-box'>
        <div className='showAnswer'>
          {parse(cards[0].answer)}
        </div>
        <div className='timings'>
          <label>&lt; {ConvertSec(cards[0].again)}</label>
          <label>  {ConvertSec(cards[0].easy)}</label>
          <label>{ConvertSec(cards[0].good)}</label>
        </div>
        <div className='answer-btns'>
          <button onClick={() => handleAgain(cards[0])} className='btn'>Again</button>
          <button onClick={(e) => handleEasyOrGood(cards[0], e)} className='btn'>Easy</button>
          <button onClick={(e) => handleEasyOrGood(cards[0], e)} className='btn'>Good</button>
        </div>
      </div>
      <button className='edit-btn' onClick={() => handleEdit(cards[0].id)}>Edit</button>
    </section>
  )
}

export default ShowAnswer
