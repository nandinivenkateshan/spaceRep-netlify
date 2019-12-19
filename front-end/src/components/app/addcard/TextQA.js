import React from 'react'
import './addcard.css'

function TextQA (props) {
  const { value, onHandleQustion, onHandleQustionBlur, onHandleAnswer, onHandleAnswerBlur,placeholder } = props
  const handleQA = e => {
    if (onHandleQustion) return onHandleQustion(e)
    return onHandleAnswer(e)
  }
  const handleQABlur = () => {
    if (onHandleQustionBlur) return onHandleQustionBlur()
    return onHandleAnswerBlur()
  }
  return (
    <textarea
      placeholder={placeholder}
      className='qa-box'
      value={value}
      onChange={e => handleQA(e)}
      onBlur={() => handleQABlur()}
      required
    />
  )
}

export default TextQA
