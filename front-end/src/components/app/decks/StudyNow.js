import React, { useEffect, useReducer } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import parse from 'html-react-parser'
import NavBar from '../navbar/Navbar'
import url from '../../Config'

const initialState = {
  arr: [],
  showStudy: true,
  showQuestion: false,
  showAnswer: false,
  edit: false,
  editId: '',
  newCards: [],
  learningCards: [],
  reviewCards: []
}

function reducer (state, action) {
  switch (action.type) {
    case 'setArr':
      return {
        ...state,
        arr: [...action.newArr],
        newCards: [...action.newCards],
        learningCards: [...action.learningCards],
        reviewCards: [...action.reviewCards]
      }
    case 'study':
      return { ...state, showStudy: false, showQuestion: true }
    case 'question':
      return { ...state, showQuestion: false, showAnswer: true }
    case 'answer' :
      return { ...state, showQuestion: true, showAnswer: false }
    case 'easyAnswer':
      return { ...state, showQuestion: true, showAnswer: false, arr: [...action.newArr] }
    case 'againAnswer':
      return { ...state, showQuestion: true, showAnswer: false, arr: [...action.newArr] }
    case 'goodAnswer':
      return { ...state, showQuestion: true, showAnswer: false, arr: [...action.newArr] }
    case 'edit' :
      return { ...state, edit: true, editId: action.editId }
    default: console.log('Unexpected action')
  }
}

function StudyNow () {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { id: deckName } = useParams()
  let answerDiv, studyDiv, questionDiv, congratsMsg
  const sid = JSON.parse(window.localStorage.getItem('session'))

  useEffect(() => {
    async function getDataFromDb () {
      const data = await window.fetch(`${url}/cards/?sid=${sid}`)
      const res = await data.json()
      const res1 = res.filter(item => item.deck === deckName)
      console.log('dta', res1)
      const res2 = res1.reduce((acc, cv) => {
        if (Number(cv.deckclicktime) >= Number(cv.timestamp)) {
          acc.push(cv)
        }
        return acc
      }, [])
      const newCards = res2.filter(item => item.status === 'new')
      console.log('new', newCards)
      const learningCards = res2.filter(item => item.status === 'learning')
      console.log('learn', learningCards)
      const reviewCards = res2.filter(item => item.status === 'review')
      console.log('review', reviewCards)
      dispatch({ type: 'setArr', newArr: res2, newCards: newCards, learningCards: learningCards, reviewCards: reviewCards })
    }
    getDataFromDb()
  }, [])

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

  function handleStudy () {
    dispatch({ type: 'study' })
  }

  function handleQuestion () {
    dispatch({ type: 'question' })
  }

  function ConvertSec (n) {
    const time = []
    const day = parseInt(n / (24 * 3600))
    if (day) time.push(` ${day}d`)
    n = (n % (24 * 3600))
    const hour = parseInt(n / 3600)
    if (hour) time.push(` ${hour}hour`)
    n = parseInt(n % 3600)
    const min = parseInt(n / 60)
    if (min) time.push(` ${min}min`)

    n = parseInt(n % 60)
    const sec = n
    if (sec) time.push(sec + 'sec')
    return time
  }

  function handleEasyAnswer (array) {
    console.log('array', array)
    let { id, status, easy, good, again } = array
    const timeToDelay = easy
    const oldStatus = status
    if (oldStatus === 'new') {
      console.log('new cards')
      status = 'learning'
      easy = 86400 // 1 day
      good = 259200 // 3 days
    }
    if (oldStatus === 'learning') {
      console.log('learning card')
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
    dispatch({ type: 'easyAnswer', newArr: state.arr.slice(1) })
  }

  function handleAgainAnswer (array) {
    let { id, status, again, easy, good } = array
    status = 'learning'
    easy = 86400 // 1 day
    good = 259200 // 3 day

    const timeStamp = parseInt(Date.now() / 1000)
    modifyTimeStamp(`${url}/updateTimeStamp`,
      { id, again, easy, good, timeStamp, status }
    )
    dispatch({ type: 'againAnswer', newArr: [...state.arr.slice(1), state.arr[0]] })
  }

  function handleGoodAnswer (array) {
    let { id, status, good, easy, again } = array
    const timeToDelay = good
    const oldStatus = status
    if (oldStatus === 'new') {
      status = 'learning'
      easy = 86400 // 1 day
      good = 259200 // 3 day
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
      { id, good, easy, again, timeStamp, status }
    )
    dispatch({ type: 'goodAnswer', newArr: state.arr.slice(1) })
  }

  if (state.showStudy) {
    studyDiv = (
      <main className='study-box'>
        <h1 className='heading'>{deckName.toUpperCase()}</h1>
        <section className='details'>
          <div className='count'>
            <label>New</label>
            <label>{state.newCards.length}</label>
          </div>
          <div className='count'>
            <label>In Learning</label>
            <label>{state.learningCards.length}</label>
          </div>
          <div className='count'>
            <label>To Review</label>
            <label>{state.reviewCards.length}</label>
          </div>
        </section>
        <button onClick={() => handleStudy()} className='study-btn'>Study Now</button>
      </main>)
  }

  function handleEdit (id) {
    dispatch({ type: 'edit', editId: id })
  }

  if (state.showQuestion && state.arr.length) {
    questionDiv = (
      <section>
        <div className='showQuestion-box'>
          <div className='showQuestion'>
            {parse(state.arr[0].question)}
          </div>
          <button onClick={() => handleQuestion()} className='study-btn'>Show Answer</button>
        </div>
        <button className='edit-btn' onClick={() => handleEdit(state.arr[0].id)}>Edit</button>
      </section>
    )
  }

  if (state.showAnswer && state.arr.length) {
    answerDiv = (
      <section>
        <div className='showAnswer-box'>
          <div className='showAnswer'>
            {parse(state.arr[0].answer)}
          </div>
          <div className='timings'>
            <label>&lt; {ConvertSec(state.arr[0].again)}</label>
            <label>  {ConvertSec(state.arr[0].easy)}</label>
            <label>{ConvertSec(state.arr[0].good)}</label>
          </div>
          <div className='answer-btns'>
            <button onClick={() => handleAgainAnswer(state.arr[0])} className='btn'>Again</button>
            <button onClick={() => handleEasyAnswer(state.arr[0])} className='btn'>Easy</button>
            <button onClick={() => handleGoodAnswer(state.arr[0])} className='btn'>Good</button>
          </div>
        </div>
        <button className='edit-btn' onClick={() => handleEdit(state.arr[0].id)}>Edit</button>
      </section>
    )
  }

  if (!state.arr.length) {
    congratsMsg = <p className='congrats-msg'>Congratulations ! You have finished this deck for now</p>
  }

  return (
    <main className='main'>
      <NavBar />
      {state.edit &&
        <Redirect to={`/edit/${state.editId}`} />}
      {studyDiv || answerDiv || questionDiv || congratsMsg}
    </main>
  )
}

export default StudyNow
