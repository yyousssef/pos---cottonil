// Minimal Express server for POS auth
// Run with: node server.js

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const app = express()
app.use(cors())
app.use(express.json())

// Demo operator database (hashed PINs)
// In production, use a real database!
const operators = [
  { id: 1, name: 'أحمد محمد', pinHash: '$2a$10$YourHashedPinHere...' },
  { id: 2, name: 'سارة أحمد', pinHash: '$2a$10$YourHashedPinHere...' },
  { id: 3, name: 'محمد علي', pinHash: '$2a$10$YourHashedPinHere...' },
]

// POST /api/auth/verify
app.post('/api/auth/verify', async (req, res) => {
  const { operatorId, pin } = req.body

  if (!operatorId || !pin) {
    return res.status(400).json({ message: 'Missing operatorId or pin' })
  }

  const operator = operators.find(o => o.id === operatorId)
  if (!operator) {
    return res.status(401).json({ message: 'Operator not found' })
  }

  // Verify PIN with bcrypt
  // For demo: compare with plain text (REPLACE with bcrypt in production!)
  // const isValid = await bcrypt.compare(pin, operator.pinHash)

  // Demo mode: accept any 4-digit PIN
  // REMOVE THIS IN PRODUCTION!
  const isValid = pin.length === 4

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid PIN' })
  }

  res.json({ valid: true, operator: { id: operator.id, name: operator.name } })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 POS Auth Server running on http://localhost:${PORT}`)
  console.log(`📋 Endpoints:`)
  console.log(`   POST http://localhost:${PORT}/api/auth/verify`)
  console.log(`   GET  http://localhost:${PORT}/api/health`)
})
