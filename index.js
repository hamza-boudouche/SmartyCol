const express = require('express')
const morgan = require('morgan')
const { adjustments } = require("./adjustments")

const app = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/api/arduino/', (req, res) => {
	const currentStatus = req.body
	res.status(200).json(adjustments(currentStatus))
})

app.listen(port, () => {
	console.log(`SmartCol server is running on port ${port}`)
})