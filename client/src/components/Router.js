import React from 'react'
import Home from './home/Home'
import SignUp from './sign-up/SignUp'
import Login from './login/Login'
import ShowDeckNames from './app/decks/ShowDeckNames'
import Addcard from './app/addcard/Addcard'
import Form from './app/edit/Edit'
import NotFound from './NotFound'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import StudyNow from './app/decks/StudyNow'

function routes () {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/decks/:id' component={StudyNow} />
        <Route exact path='/decks' component={ShowDeckNames} />
        <Route exact path='/add' component={Addcard} />
        <Route exact path='/edit/:id' component={Form} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}
export default routes
