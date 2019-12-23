require('dotenv').config()
const bcrypt = require('bcrypt')
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

/* User Details */

const getUserDetails = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM signup')
    res.json(result.rows)
  } catch (error) {
    console.log('Error while fething the sign up details')
  }
}

const addUserDetails = async (req, res) => {
  const { user_name: name, user_email: mail, pswd } = req.body
  const hashedPswd = await bcrypt.hash(pswd, 10)
  try {
    await pool.query('INSERT INTO signup (user_name, user_email, pswd) VALUES ($1,$2,$3)', [name, mail, hashedPswd])
    res.send({ success: 'Added user details successfully' })
  } catch (err) {
    res.send({ error: 'Email already exist' })
  }
}

const login = async (req, res) => {
  const { user_email: mail, pswd } = req.body
  try {
    const result = await pool.query('SELECT * FROM signup WHERE user_email=$1', [mail])
    const val = result.rows
    if (val.length === 0) res.send({ res: 'No User with this Email' })
    else {
      if (await bcrypt.compare(pswd, val[0].pswd)) {
        const obj = {
          action: true,
          sid: mail + Math.random()
        }
        const result = await addToAuthenticatonTable([mail, obj.action, obj.sid])
        if (result) res.send(result)
      } else {
        res.send({ res: 'Password is incorrect' })
      }
    }
  } catch (e) {
    console.log('unable to fetch login details')
  }
}

const addToAuthenticatonTable = async data => {
  const [, , sid] = data
  try {
    await pool.query('INSERT INTO authentication(email,action,sid) VALUES ($1,$2,$3)', data)
    return ({
      sid: sid,
      msg: 'pass'
    })
  } catch (e) {
    console.log('error in authentication')
  }
}

const logout = async (req, res) => {
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [req.query.sid])
    const email = val.rows[0].email
    await pool.query('UPDATE authentication SET action=false WHERE email=$1', [email])
    res.send('Logged out succesfully ')
  } catch (e) { console.log('Unable to update the authentication') }
}

/* cards details */
const getCards = async (req, res) => {
  const sid = req.query.sid
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    const email = val.rows[0].email
    const result = await pool.query('SELECT * FROM cards WHERE email=$1', [email])
    res.json(result.rows)
  } catch (e) {
    console.log('Error while fetching data')
  }
}
const account = async (req, res) => {
  const sid = req.query.sid
  try {
    const val = await pool.query('SELECT email, action FROM authentication WHERE sid=$1', [sid])
    const { email, action } = val.rows[0]
    if (action === 'true') {
      const result = await pool.query('SELECT * FROM signup WHERE user_email=$1', [email])
      res.send({ user: result.rows[0].user_name })
    } else { res.send({ fail: 'User has to login' }) }
  } catch (e) { console.log('error in fetching') }
}

const addCard = async (req, res) => {
  const { deck, question, answer, status, sid, again, easy, good } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    const result = await pool.query('INSERT INTO cards (deck, question, answer, status,email,again, easy, good) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [deck, question, answer, status, val.rows[0].email, again, easy, good])
    res.send(result.rows)
  } catch (e) {
    console.log('Error while adding card')
  }
}

const deckNames = async (req, res) => {
  const sid = req.query.sid
  const val = await pool.query('SELECT email, action FROM authentication WHERE sid=$1', [sid])
  const check = val.rows[0].action
  if (check === 'true') {
    const email = val.rows[0].email
    const result = await pool.query('SELECT DISTINCT ON(deck) deck, id FROM cards WHERE email=$1', [email])
    res.send(result.rows)
  }
}

const updateDeckClickTime = async (req, res) => {
  const { deck, deckClickTime, sid } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    await pool.query('UPDATE cards SET deckclicktime=$2 WHERE deck=$1 and email=$3',
      [deck, deckClickTime, val.rows[0].email])
    res.send('Updated deckclicktime successfully')
  } catch (e) {
    console.log('Error in updating deck click time')
  }
}

const updateTimeStamp = async (req, res) => {
  const { id, timeStamp, easy, good, again, status, sid } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    await pool.query('UPDATE cards SET timestamp=$1, status=$3,easy=$5, good=$6, again=$7 WHERE id=$2 and email=$4', [timeStamp, id, status, val.rows[0].email, easy, good, again])
    res.send('Updated timeStamp successfully')
  } catch (e) {
    console.log('Error while updating timeStamp')
  }
}

const modifyDeckName = async (req, res) => {
  const { reName, deckName, sid } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    await pool.query('UPDATE cards SET deck=$1 WHERE deck=$2 and email=$3', [reName, deckName, val.rows[0].email])
    res.send('Updated deckname successfully')
  } catch (e) {
    console.log('Error while modifying deckname')
  }
}

const deleteDeck = async (req, res) => {
  const { deckName, sid } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    await pool.query('DELETE FROM cards WHERE deck=$1 and email=$2', [deckName, val.rows[0].email])
    res.send('Deleted deck successfully')
  } catch (e) {
    console.log('Error in deleting deck')
  }
}

const updateCard = async (req, res) => {
  const { id, deck, question, answer, sid } = req.body
  try {
    const val = await pool.query('SELECT email FROM authentication WHERE sid=$1', [sid])
    await pool.query('UPDATE cards SET deck=$2, question=$3, answer=$4 WHERE id=$1 and email=$5',
      [id, deck, question, answer, val.rows[0].email])
    res.send('Updated card successfully')
  } catch (e) {
    console.log('Error while updating card')
  }
}

module.exports = {
  addCard,
  getCards,
  updateTimeStamp,
  getUserDetails,
  addUserDetails,
  updateDeckClickTime,
  login,
  modifyDeckName,
  deleteDeck,
  updateCard,
  deckNames,
  logout,
  account
}
