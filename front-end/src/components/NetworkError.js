import React from 'react'
import styled from 'styled-components'

function NetworkError () {
  const Heading = styled.p`
    text-align: center;
    margin-top: 80px;
    font-size: 30px
    `
  return (
    <main>
      <Heading>Server is down. Please try again later</Heading>
    </main>
  )
}

export default NetworkError
