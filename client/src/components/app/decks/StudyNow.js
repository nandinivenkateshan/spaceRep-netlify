import React, { useEffect, useReducer } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import NavBar from '../navbar/Navbar'
import url from '../../config'
import ShowQues from './ShowQues'
import ShowAnswer from './ShowAnswer'

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
  let studyDiv, congratsMsg
  const sid = JSON.parse(window.localStorage.getItem('session'))

  useEffect(() => {
    async function getDataFromDb () {
      const data = await window.fetch(`${url}/cards/?sid=${sid}`)
      const res = await data.json()
      const res1 = res.filter(item => item.deck === deckName)
      const res2 = res1.reduce((acc, cv) => {
        if (Number(cv.deckclicktime) >= Number(cv.timestamp)) {
          acc.push(cv)
        }
        return acc
      }, [])
      const newCards = res2.filter(item => item.status === 'new')
      const learningCards = res2.filter(item => item.status === 'learning')
      const reviewCards = res2.filter(item => item.status === 'review')
      dispatch({ type: 'setArr', newArr: res2, newCards: newCards, learningCards: learningCards, reviewCards: reviewCards })
    }
    getDataFromDb()
  }, [])

  function handleStudy () {
    dispatch({ type: 'study' })
  }

  function handleQuestion () {
    dispatch({ type: 'question' })
  }

  function handleAgain (card) {
    dispatch(card)
  }

  function handleEasyOrGood (card) {
    dispatch(card)
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

  if (!state.arr.length) {
    congratsMsg = <p className='congrats-msg'>Congratulations ! You have finished this deck for now</p>
  }

  return (
    <main className='main'>
      <NavBar />
      {studyDiv || congratsMsg}
      {state.edit &&
        <Redirect to={`/edit/${state.editId}`} />}

      {state.showQuestion && state.arr.length &&
        <ShowQues
          question={state.arr[0].question}
          id={state.arr[0].id}
          onQuestion={() => handleQuestion()}
          onEdit={id => handleEdit(id)}
        />}

      {state.showAnswer && state.arr.length &&
        <ShowAnswer
          cards={state.arr}
          onAgainAns={card => handleAgain(card)}
          onEasyOrGood={card => handleEasyOrGood(card)}
          onEdit={id => handleEdit(id)}
        />}

    </main>
  )
}

export default StudyNow
