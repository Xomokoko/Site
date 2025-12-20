import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', name: 'ETUDE' })
})
let sessions = [
  { id: 1, title: 'Révision Math', duration: 50 },
  { id: 2, title: 'Lecture Histoire', duration: 30 }
]

app.get('/api/sessions', (req, res) => {
  res.json({ sessions })
})

app.post('/api/sessions', (req, res) => {
  const session = req.body
  session.id = Date.now()
  sessions.push(session)
  res.status(201).json(session)
})

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})
