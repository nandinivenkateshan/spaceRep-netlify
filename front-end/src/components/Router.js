import React from 'react'
import Home from './home/Home'
import SignUp from './sign-up/SignUp'
import Login from './login/Login'
import Logout from './login/Logout'
import Navbar from './app/navbar/Navbar'
import Decks from './app/decks/Decks'
import Addcard from './app/addcard/Addcard'
import Form from './app/edit/Edit'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import StudyNow from './app/decks/StudyNow'

function routes () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/signup' component={SignUp} />
        <Route path='/login' component={Login} />
        <Route path='/loggedIn' component={Navbar} />
        <Route exact path='/decks/:id' component={StudyNow} />
        <Route path='/decks' component={Decks} />
        <Route path='/add' component={Addcard} />
        <Route exact path='/edit/:id' component={Form} />
        <Route path='/loggedout' component={Logout} />
      </Switch>
    </Router>
  )
}
export default routes
