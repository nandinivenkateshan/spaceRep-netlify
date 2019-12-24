require('dotenv').config()
const express = require('express')
const db = require('./query')
const app = express()
const path = require('path')
const port = process.env.PORT || 8080
app.use(express.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  })
}

app.get('/getUserDetails', db.getUserDetails)
app.get('/cards', db.getCards)
app.post('/card', db.addCard)
app.post('/addUserDetails', db.addUserDetails)
app.post('/updateTimeStamp', db.updateTimeStamp)
app.post('/updateDeckClickTime', db.updateDeckClickTime)
app.post('/login', db.login)
app.post('/modifyDeckName', db.modifyDeckName)
app.post('/deleteDeck', db.deleteDeck)
app.post('/updateCard', db.updateCard)
app.get('/deckNames', db.deckNames)
app.get('/logout', db.logout)
app.get('/account', db.account)

app.listen(port, () => console.log(`Server running on the port ${port}`))
