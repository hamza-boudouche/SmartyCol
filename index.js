const express = require('express')
const morgan = require('morgan')
const { cardExists, plantIds, adjustments } = require("./adjustments")

const app = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/api/test', (req, res) => {
	res.send('hello world');
})

app.post('/api/arduino/:arduinoId', (req, res) => {
	console.log('begin')
	const arduinoId = req.params['arduinoId']
	const currentStatus = req.body
	console.log(`arduinoID = ${arduinoId}`)
	console.log(`currentStatus = ${currentStatus}`)
	const output = adjustments(arduinoId, currentStatus)
	console.log(output)
	res.status(200).json(output)
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