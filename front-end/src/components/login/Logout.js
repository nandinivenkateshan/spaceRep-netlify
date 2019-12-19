import React, { useEffect } from 'react'
import Login from './Login'
import url from '../Config'

function Logout () {
  const sid = JSON.parse(window.localStorage.getItem('session'))
  useEffect(() => {
    window.fetch(`${url}/logout/?sid=${sid}`)
  }, [])

  return (
    <div>
      <Login />
    </div>
  )
}

export default Logout
