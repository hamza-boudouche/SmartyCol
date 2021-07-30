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

const adjustments = async (arduinoId, currentStatus) => {
  const card = await getCards({ idCard: arduinoId })
  const { idBloc } = card[0]
  const plantes = await getPlantes({ idBloc })
  const bloc = await getBlocs({ idBloc })
  const { typePlante } = bloc[0]
  const { phases } = await getCycleDeVie({ typePlante })

  for (let i = 0; i < plantes.length; i++) {
    const age = (new Date()).getTime() - plantes[i].datePlantation.getTime()
    let cumule = 0;
    let phase = 0;
    while (cumule < age) {
      if (phase >= phases.length) {
        return
      }
      cumul += phases.find(el => el.rang == phase).duree
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

  // const result2 = {
  //   success: true,
  //   changes: [
  //     {
  //       plantID: 11,
  //       temperature: -4,
  //       moisture: 8,
  //       nitrogen: 3,
  //       phosphorus: 8,
  //       potassium: 5,
  //       oxygen: 14,
  //       carbon: 2,
  //       light: 0,
  //     },
  //     {
  //       plantID: 12,
  //       temperature: -4,
  //       moisture: 8,
  //       nitrogen: 3,
  //       phosphorus: 8,
  //       potassium: 5,
  //       oxygen: 14,
  //       carbon: 2,
  //       light: 0,
  //     },
  //     {
  //       plantID: 13,
  //       temperature: -4,
  //       moisture: 8,
  //       nitrogen: 3,
  //       phosphorus: 8,
  //       potassium: 5,
  //       oxygen: 14,
  //       carbon: 2,
  //       light: 0,
  //     },
  //     {
  //       plantID: 14,
  //       temperature: -4,
  //       moisture: 8,
  //       nitrogen: 3,
  //       phosphorus: 8,
  //       potassium: 5,
  //       oxygen: 14,
  //       carbon: 2,
  //       light: 0,
  //     }
  //   ],
  // };
  return result;
};

module.exports = { cardExists, plantIds, adjustments }
