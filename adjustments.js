const grubbs = require('grubbs');
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

const cardExists = async (arduinoId) => {
  const cards = await getCards({ idCard: arduinoId })
  if (cards.length == 0) {
    return false
  }
  return true
}

const plantIds = async (arduinoId) => {
  const result = []
  const card = await getCards({ idCard: arduinoId })
  if (card.length == 0) {
    return
  }
  const { idBloc } = card[0]
  const plants = await getPlantes({ idBloc })
  plants.forEach(plant => {
    result.push(plant.idPlante)
  });
  return result
}

// add insert in temp storage
const adjustments = async (currentStatus) => {
  const card = await getCards({ idCard: currentStatus.arduinoId })
  const { idBloc } = card[0]
  const plantes = await getPlantes({ idBloc })
  const bloc = await getBlocs({ idBloc })
  const { typePlante } = bloc[0]
  const { phases } = await getCycleDeVie({ typePlante })

  await insertTempStorage({
    idBloc,
    mesures: currentStatus.plants
  })

  for (let i = 0; i < plantes.length; i++) {
    const age = (new Date()).getTime() - plantes[i].datePlantation.getTime()
    let cumule = 0;
    let phase = 0;
    while (cumule < age) {
      if (phase >= phases.length) {
        return
      }
      cumule += phases.find(el => el.rang == phase).duree
      phase++
    }
    phase--
    plantes[i].currentPhase = phase
  }

  const result = {
    success: true,
    changes: []
  }

  plantes.forEach(plante => {
    result.changes.push({
      plantId: plante.idPlante,
      temperature: phases.find(el => el.rang == plante.currentPhase).temperature - currentStatus.plants.find(el => el.plantID == plante.idPlante).temperature,
      moisture: phases.find(el => el.rang == plante.currentPhase).moisture - currentStatus.plants.find(el => el.plantID == plante.idPlante).moisture,
      nitrogen: phases.find(el => el.rang == plante.currentPhase).nitrogen - currentStatus.plants.find(el => el.plantID == plante.idPlante).nitrogen,
      phosphorus: phases.find(el => el.rang == plante.currentPhase).phosphorus - currentStatus.plants.find(el => el.plantID == plante.idPlante).phosphorus,
      potassium: phases.find(el => el.rang == plante.currentPhase).potassium - currentStatus.plants.find(el => el.plantID == plante.idPlante).potassium,
      oxygen: phases.find(el => el.rang == plante.currentPhase).oxygen - currentStatus.plants.find(el => el.plantID == plante.idPlante).oxygen,
      carbon: phases.find(el => el.rang == plante.currentPhase).carbon - currentStatus.plants.find(el => el.plantID == plante.idPlante).carbon,
      light: phases.find(el => el.rang == plante.currentPhase).light - currentStatus.plants.find(el => el.plantID == plante.idPlante).light,
    })
  })

  return result;
};

const saveToPermStorage = async () => {
  const entries = await getTempStorage({})
  const idBlocs = entries.map(entry => entry.idBloc)
  idBlocs.forEach(idBloc => {
    const entriesByBloc = entries.filter(entry => entry.idBloc === idBloc)
    const moyennes = {
      temperature: [],
      moisture: [],
      nitrogen: [],
      phosphorus: [],
      potassium: [],
      oxygen: [],
      carbon: [],
      light: []
    }
    entriesByBloc.forEach(entry => {
      moyennes.temperature.push(entry.mesurse.temperature)
      moyennes.moisture.push(entry.mesurse.moisture)
      moyennes.nitrogen.push(entry.mesurse.nitrogen)
      moyennes.phosphorus.push(entry.mesurse.phosphorus)
      moyennes.potassium.push(entry.mesurse.potassium)
      moyennes.oxygen.push(entry.mesurse.oxygen)
      moyennes.carbon.push(entry.mesurse.carbon)
      moyennes.light.push(entry.mesurse.light)
    })
    for (const key in moyennes) {
      const result = grubbs.test(moyennes[key])
      try {
        if (result[1].dataset) {
          moyennes[key] = result[1].average
        }
      }
      catch (err) {
        moyennes[key] = result[0].average
      }
    }
    moyennes.date = new Date()

    const newPermStorEntry = {
      idBloc,
      mesures: moyennes
    }
    await deleteTempStorage({})
    await insertPermStorage(newPermStorEntry)
  })
}

module.exports = { cardExists, plantIds, adjustments, saveToPermStorage }
