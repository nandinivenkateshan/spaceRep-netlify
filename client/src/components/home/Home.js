import React from 'react'
import './home.css'
import Navbar from '../navbar/Nav-register'

function Home () {
  return (
    <main className='main'>
      <Navbar signup='signUp' login='logIn' />
      <section className='about'>
        <p className='first-para'>
            SpaceRep is a free companion to the computer version of Anki. It can
            be used to review online when you don't have access to your home
            computer, and can be used to keep your cards synchronized across
            multiple machines.
        </p>
        <p className='second-para'>
            SpaceRep is intended to be used in conjunction with the computer
            version of Anki. While it is possible to create basic text-only
            cards and review them using only SpaceRep.
        </p>
      </section>
    </main>
  )
}

export default Home
