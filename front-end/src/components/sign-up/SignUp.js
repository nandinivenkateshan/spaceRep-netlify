import React, { useState } from 'react'
import './signUp.css'
import useForm from './useForm'
import validate from './SignUPFormValidation'
import Navbar from '../navbar/Nav-register'
import url from '../Config'
import { Redirect } from 'react-router-dom'

function SignUp () {
  const [status, setStatus] = useState('')
  const [resMsg, setResMsg] = useState({})
  const [userDetails, setUserDetails] = useState([])
  const { handleChange, handleSubmit, values, errors } = useForm(
    login,
    validate
  )

  const updateUserDetails = async (url, data) => {
    const res = await window.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await res.json()
    setStatus(res.ok)
    setResMsg(response)
  }

  function login () {
    updateUserDetails(`${url}/addUserDetails`, values)
    setUserDetails([...userDetails, values])
  }

  return (
    <main className='signup-page'>
      <Navbar login='logIn' />
      <section className='signup-box'>
        <h1 className='heading'>Create a new account</h1>
        <p className='sub-heading'>It's free and always will be.</p>
        <form className='signup-form' onSubmit={e => handleSubmit(e)}>
          <label htmlFor='username' className='label'>
            Username
          </label>
          <input
            type='text'
            placeholder='Enter your name'
            id='username'
            name='user_name'
            className={`input${errors.user_name && 'invalid'}`}
            onChange={e => handleChange(e)}
            value={values.user_name || ''}
          />
          {errors.user_name && (
            <p className='invalid-para'>{errors.user_name}</p>
          )}
          <label htmlFor='email' className='label'>
            Your Email
          </label>
          <input
            type='email'
            placeholder='Enter your Email'
            id='email'
            name='user_email'
            className={`input${errors.user_email && 'invalid'}`}
            onChange={e => handleChange(e)}
            value={values.user_email || ''}
          />
          {errors.user_email && (
            <p className='invalid-para'>{errors.user_email}</p>
          )}
          <label htmlFor='pswd' className='label'>
            New Password
          </label>
          <input
            type='password'
            id='pswd'
            name='pswd'
            className={`input${errors.pswd && 'invalid'}`}
            placeholder='Enter the password'
            onChange={e => handleChange(e)}
            value={values.pswd || ''}
            minLength='6'
          />
          {errors.pswd && <p className='invalid-para'>{errors.pswd}</p>}
          <button className='signup-btn'>Sign Up </button>
        </form>
        {status && resMsg.error && (
          <p className='acc-exist-already'>
            Sorry, an account with this email address already exists.
          </p>
        )}
        {status && resMsg.success && (
          <Redirect to='/login' />
        )}
      </section>
    </main>
  )
}

export default SignUp
