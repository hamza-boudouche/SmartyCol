const express = require('express')
const morgan = require('morgan')
const { cardExists, plantIds, adjustments } = require("./adjustments")

const app = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/api/arduino/:arduinoId', (req, res) => {
	const arduinoId = req.params['arduinoId']
	const currentStatus = req.body
	res.status(200).json(adjustments(arduinoId, currentStatus))
})

app.get('/api/arduino/plants/:arduinoId', (req, res) => {
	const arduinoId = req.params['arduinoId']
	if(!cardExists(arduinoId)){
		res.status(404).json({sucess: false})
	}
	res.status(200).json({sucess: true, plants: plantIds(arduinoId)})
})

app.listen(port, () => {
	console.log(`SmartCol server is running on port ${port}`)
})