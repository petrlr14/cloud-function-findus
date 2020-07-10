const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const answers = {
  age: {
    "1": "18 - 25",
    "2": "26 - 35",
    "3": "36 - 45",
    "4": "46 - 55",
    "5": "56 - 65",
    "6": "66 - 75",
    "7": "más de 75",
  },
  sex: {
    "1": "Hombre",
    "2": "Mujer",
  },
  department: {
    "1": "Ahuachapán",
    "2": "Cabańas",
    "3": "Chalatenango",
    "4": "Cuscatlán",
    "5": "La Libertad",
    "6": "La Paz",
    "7": "La Unión",
    "8": "Morazán",
    "9": "San Miguel",
    "10": "San Salvador",
    "11": "San Vicente",
    "12": "Santa Ana",
    "13": "Sonsonate",
    "14": "Usulután",
  },
  familiesCount: {
    "1": "De 0 a 20",
    "2": "De 21 a 50",
    "3": "De 51 a 100",
    "4": "De 101 a 250",
    "5": "De 251 a 500",
    "6": "De 501 a 750",
    "7": "De 751 a 1,000",
    "8": "De 1,001 a 1,500",
    "9": "De 1,501 a 2,000",
    "10": "Más de 2,000",
  },
  houseMaterial: {
    "1": "Concreto",
    "2": "Bahareque",
    "3": "Adobe",
    "4": "Madera",
    "5": "Lámina metálica",
    "6": "Paja o palma",
    "7": "Materiales de desecho",
  },
  drinkingWater: {
    "1": "Nacimientos de agua o ríos",
    "2": "Pozo",
    "3": "Pipas de Anda u otra institución",
    "4": "Chorros comunitarios",
    "5": "Sistema de cañerías",
  },
  jobPreCovid: {
    "1": "Empleado a tiempo completo",
    "2": "Empleado a tiempo parcial",
    "3": "Trabajador independiente",
    "4": "Negocio propio",
    "5": "Vendedor ambulante",
    "6": "Ama de casa",
    "7": "Desempleado",
  },
  jobWhilePandemic: {
    state: {
      "1": "Ha aumentado",
      "2": "Se ha mantenido igual",
      "3": "Ha disminuido un poco",
      "4": "Ha disminuido mucho",
    },
    detail: {
      "1": "He tenido reducción de ingresos.",
      "2": "Me mantengo trabajando por sin recibir ingresos.",
      "3": "Estoy en suspensión de contrato sin percibir ingresos.",
      "4": "Me han despedido de mi trabajo.",
    },
  },
  salaryWhilePandemic: {
    state: {
      "1": "Ha aumentado",
      "2": "Se ha mantenido igual",
      "3": "Ha disminuido un poco",
      "4": "Ha disminuido mucho",
    },
    detail: {
      "1": "He encontrado un nuevo trabajo.",
      "2": "Me han dado un aumento.",
      "3": "He abierto mi propio negocio.",
      "4": "Recibo ayudo de familiares.",
    },
  },
  affectedByStorms: {
    "1": "No me afectó o afectó poco.",
    "2": "Perdí algunas de mis pertenencias.",
    "3": "Perdí todas mis pertenencias.",
  },
  support: {
    gov: {
      "1": "Sí, mi familia resultó beneficiada con el bono de $300.",
      "2":
        "Sí, mi familia resultó beneficiada con el bono de $300 y canastas solidarias.",
      "3": "Sí, mi familia ha recibido canastas solidarias.",
      "4":
        "No, pero he recibido ayuda de otras instituciones (iglesias, fundaciones, etc.).",
      "5": "No he recibido ayuda de ningún tipo.",
    },
    count: {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "Más de 4",
      "5": "No he recibido ayuda",
    },
    lastTime: {
      "1": "En la última semana.",
      "2": "En el último mes.",
      "3": "En los últimos 2 meses.",
      "4": "En los últimos 3 meses.",
      "5": "No he recibido ayuda.",
    },
  },
  needs: {
    "1": "Alimentos de la canasta básica.",
    "2":
      "Insumos médicos (mascarillas, alcohol gel, artículos de limpieza, etc.).",
    "3": "Medicamentos.",
    "4": "Vestuario.",
    "5": "No tengo necesidad.",
  },
};

exports.save = functions.https.onRequest((request, response) => {
  const body = JSON.parse(request.body.Memory);
  const bodyParsed = body.twilio;
  const personal = bodyParsed["messaging.whatsapp"];
  const data = bodyParsed["collected_data"];
  const form_1 = data["form_1"].answers;
  const form_2 = data["form_2"].answers;
  const form_3 = data["form_3"];
  const form_4 = data["form_4"].answers;
  const form_5 = data["form_5"];
  const form_6 = data["form_6"].answers;
  const user = {
    phone: personal.From.split(":")[1],
    answers: {
      name: data["name"].answers.form_name.answer,
      age: answers.age[form_1.age.answer],
      sex: answers.sex[form_1.gender.answer],
      residence: {
        department: answers.department[form_1.departament.answer],
        town: form_1.municipio.answer,
        suburb: form_1.colonia.answer,
        familiesCount: answers.familiesCount[form_1.familiesCount.answer],
      },
      peopleAtHome: {
        over18: form_1.familyCount.answer,
        elders: form_1.elders.answer,
        under18: form_1.underAge.answer,
        sick: form_1.sick.answer,
      },
      houseMaterial: answers.houseMaterial[form_1.material.answer],
      drinkingWater: answers.drinkingWater[form_1.water.answer],
      jobPreCovid: answers.jobPreCovid[form_1.jobPreCovid.answer],
      jobWhilePandemic: {
        state: answers.jobWhilePandemic.state[form_2.jobCondition.answer],
        detail: form_3
          ? answers.jobWhilePandemic.detail[
              form_3.answers.jobConditionDetail.answer
            ]
          : "Sin detalle",
      },
      salaryWhilePandemic: {
        state: answers.salaryWhilePandemic.state[form_4.salaryCondition.answer],
        detail: form_5
          ? answers.salaryWhilePandemic.detail[
              form_5.answers.salaryConditionDetail.answer
            ]
          : "Sin detalle",
      },
      affectedByStorms: answers.affectedByStorms[form_6.benefits.answer],
      support: {
        gov: answers.support.gov[form_6.benefits.answer],
        count: answers.support.count[form_6.benefitsCount.answer],
        lastTime: "",
      },
      needs: answers.needs[form_6.needs.answer],
    },
  };
  admin
    .database()
    .ref("/register")
    .push(user, (error) => {
      console.log(error);
      response.status(200);
    });
});

