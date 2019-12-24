import React from 'react'
import parse from 'html-react-parser'

function ShowQues ({ question, id, onQuestion, onEdit }) {
  function handleQuestion () {
    onQuestion()
  }
  function handleEdit (id) {
    onEdit(id)
  }
  return (
    <section>
      <div className='showQuestion-box'>
        <div className='showQuestion'>
          {parse(question)}
        </div>
        <button onClick={() => handleQuestion()} className='study-btn'>Show Answer</button>
      </div>
      <button className='edit-btn' onClick={() => handleEdit(id)}>Edit</button>
    </section>
  )
}

export default ShowQues
