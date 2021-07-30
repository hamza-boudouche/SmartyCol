require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		console.log('connected to mongodb')
	} catch (error) {
		console.log('failed to connect to mongodb')
	}
}

const cardSchema = new mongoose.Schema({
	idCard: Number,
	type: String,
	status: Boolean,
	idBloc: Number
})
const Card = mongoose.model('Cards', cardSchema)

const insertCard = async (newCard) => {
	await connectDB()
	await newCard.save()
	await mongoose.disconnect()
}

const getCards = async (filter) => {
	await connectDB()
	const cards = await Card.find(filter)
	await mongoose.disconnect()
	return cards
}

const updateCards = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await Card.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteCards = async (filter) => {
	await connectDB()
	const res = await Card.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const moduleSchema = new mongoose.Schema({
	idModule: Number,
	idCard: Number,
	libelle: String,
	type: String,
	pin: Number,
	statut: Boolean
})

const Module = mongoose.model('Modules', moduleSchema)

const insertModule = async (newModule) => {
	await connectDB()
	await newModule.save()
	await mongoose.disconnect()
}

const getModules = async (filter) => {
	await connectDB()
	const modules = await Module.find(filter)
	await mongoose.disconnect()
	return modules
}

const updateModules = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await Module.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteModules = async (filter) => {
	await connectDB()
	const res = await Module.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const parametresSchema = new mongoose.Schema({
	idParametre: Number,
	idModule: Number,
	nom: String,
	valeur: String
})

const Parametre = mongoose.model('Parametres', parametresSchema)

const insertParametre = async (newParametre) => {
	await connectDB()
	await newParametre.save()
	await mongoose.disconnect()
}

const getParametres = async (filter) => {
	await connectDB()
	const params = await Parametre.find(filter)
	await mongoose.disconnect()
	return params
}

const updateParametres = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await Parametre.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteParametres = async (filter) => {
	await connectDB()
	const res = await Parametre.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const blocSchema = new mongoose.Schema({
	idBloc: Number,
	typePlante: String
})

const Bloc = mongoose.model('Blocs', blocSchema)

const insertBloc = async (newBloc) => {
	await connectDB()
	await newBloc.save()
	await mongoose.disconnect()
}

const getBlocs = async (filter) => {
	await connectDB()
	const blocs = await Bloc.find(filter)
	await mongoose.disconnect()
	return blocs
}

const updateBlocs = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await Bloc.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteBlocs = async (filter) => {
	await connectDB()
	const res = await Bloc.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const planteSchema = new mongoose.Schema({
	idPlante: Number,
	typePlante: String,
	datePlantation: Date,
	idBloc: Number
})

const Plante = mongoose.model('Plante', planteSchema)

const insertPlante = async (newPlante) => {
	await connectDB()
	await newPlante.save()
	await mongoose.disconnect()
}

const getPlantes = async (filter) => {
	await connectDB()
	const plantes = await Plante.find(filter)
	await mongoose.disconnect()
	return plantes
}

// (async () => {
// 	console.log(await getPlantes())
// 	console.log('here')
// })()

const updatePlantes = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await Plante.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deletePlantes = async (filter) => {
	await connectDB()
	const res = await Plante.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const stockageTemporaireSchema = new mongoose.Schema({
	idBloc: Number,
	mesures: [
		{
			date: Date,
			humiditeAir: Number,
			temperature: Number,
			humiditeSol: Number,
			pottasium: Number,
			phosphore: Number,
			azote: Number
		}
	]
})

const StockageTemporaire = mongoose.model('Bloc_StockageTemporaire', stockageTemporaireSchema)

const insertTempStorage = async (newEntry) => {
	await connectDB()
	await newEntry.save()
	await mongoose.disconnect()
}

const getTempStorage = async (filter) => {
	await connectDB()
	const temp = await StockageTemporaire.find(filter)
	await mongoose.disconnect()
	return temp
}

const updateTempStorage = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await StockageTemporaire.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteTempStorage = async (filter) => {
	await connectDB()
	const res = await StockageTemporaire.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const stockagePermanentSchema = new mongoose.Schema({
	idBloc: Number,
	mesures: [
		{
			date: Date,
			humiditeAir: Number,
			temperature: Number,
			humiditeSol: Number,
			pottasium: Number,
			phosphore: Number,
			azote: Number
		}
	]
})

const StockagePermanent = mongoose.model('Bloc_StockagePermanent', stockagePermanentSchema)

const insertPermStorage = async (newEntry) => {
	await connectDB()
	await newEntry.save()
	await mongoose.disconnect()
}

const getPermStorage = async (filter) => {
	await connectDB()
	const perm = await StockagePermanent.find(filter)
	await mongoose.disconnect()
	return perm
}

const updatePermStorage = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await StockagePermanent.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deletePermStorage = async (filter) => {
	await connectDB()
	const res = await StockagePermanent.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

const cycleDeVieSchema = new mongoose.Schema({
	typePlante: String,
	phases: [
		{
			rang: Number,
			duree: Number,
			humiditeAir: Number,
			temperature: Number,
			humiditeSol: Number,
			pottasium: Number,
			phosphore: Number,
			azote: Number
		}
	]
})

const CycleDeVie = mongoose.model('CycleDeVie', cycleDeVieSchema)

const insertCycleDeVie = async (newCycle) => {
	await connectDB()
	await newCycle.save()
	await mongoose.disconnect()
}

const getCycleDeVie = async (filter) => {
	await connectDB()
	const cycle = await CycleDeVie.find(filter)
	await mongoose.disconnect()
	return cycle
}

const updateCycleDeVie = async (filter, update, upsert = true) => {
	await connectDB()
	const res = await CycleDeVie.updateMany(filter, update, {
		upsert
	})
	await mongoose.disconnect()
	return res
}

const deleteCycleDeVie = async (filter) => {
	await connectDB()
	const res = await CycleDeVie.deleteMany(filter)
	await mongoose.disconnect()
	return res
}

module.exports = {
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
}
