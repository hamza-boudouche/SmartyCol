require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { cardExists, plantIds, adjustments, saveToPermStorage } = require("./adjustments")
const {
	connectDB,
	cardCRUD: {
		cardSchema,
		Card,
		insertCard,
		getCards,
		updateCards,
		deleteCards
	},
	moduleCRUD: {
		moduleSchema,
		Module,
		insertModule,
		getModules,
		updateModules,
		deleteModules
	},
	parametresCRUD: {
		parametresSchema,
		Parametre,
		insertParametre,
		getParametres,
		updateParametres,
		deleteParametres
	},
	blocCRUD: {
		blocSchema,
		Bloc,
		insertBloc,
		getBlocs,
		updateBlocs,
		deleteBlocs
	},
	planteCRUD: {
		planteSchema,
		Plante,
		insertPlante,
		getPlantes,
		updatePlantes,
		deletePlantes,
	},
	stockageTemporaireCRUD: {
		stockageTemporaireSchema,
		StockageTemporaire,
		insertTempStorage,
		getTempStorage,
		updateTempStorage,
		deleteTempStorage,
	},
	stockagePermanentCRUD: {
		stockagePermanentSchema,
		StockagePermanent,
		insertPermStorage,
		getPermStorage,
		updatePermStorage,
		deletePermStorage,
	},
	cycleDeVieCRUD: {
		cycleDeVieSchema,
		CycleDeVie,
		insertCycleDeVie,
		getCycleDeVie,
		updateCycleDeVie,
		deleteCycleDeVie
	}
} = require('./database/dbUtils')

const app = express()
const port = process.env.PORT || 5000

app.use(morgan('combined'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/api/arduino/:arduinoId', (req, res) => {
	console.log(connectDB)
	const arduinoId = req.params['arduinoId']
	const rawStatus = req.body
	const [first, ...rest] = rawStatus
	const currentStatus = {
		arduinoId: first.arduinoId,
		plants: rest
	}
	console.log(`arduinoID = ${arduinoId}`)
	console.log(currentStatus)
	const output = adjustments(currentStatus)
	res.status(200).json(output)
})

app.get('/api/arduino/plants/:arduinoId', (req, res) => {
	const arduinoId = req.params['arduinoId']
	if (!cardExists(arduinoId)) {
		res.status(404).json({ sucess: false })
	}
	res.status(200).json({ sucess: true, plants: plantIds(arduinoId) })
})

app.listen(port, () => {
	console.log(`SmartyCol server is running on port ${port}`)
})

setInterval(() => {
	saveToPermStorage()
}, 24 * 60 * 60 * 1000) // 24 hours - 60 minutes - 60 seconds - 1000 milliseconds