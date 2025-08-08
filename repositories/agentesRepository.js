const db = require("../db/db.js")
console.log(typeof db) // deve imprimir "function"
console.log(db) // deve ser uma função com propriedades (Knex instance)


async function addAgente(object){
  try {
    const created = await db("agentes").insert(object, ["*"])
    return created

  } catch (error) {
    console.log(error)
    return false
  }
}

async function findAgente(id){
  try {
    const result = await db("agentes").where({id: id})
    if(!result){
      console.log("Função findAgente do agenteRepository não encontrou um id equivalente ao pesquisado")
      return false
    }
    return result[0]

  } catch (error) {
    console.log(error)
    return false
  }
}

async function updateAgente(id, fieldsToUpdate){
  try {
    const updated = await db("agentes").where({id:id}).update(fieldsToUpdate, ["*"])
    if(!updated){
      console.log("Função updateAgente do agenteRepository não conseguiu atualizar o objeto")
    }
    return updated[0]

  } catch (error) {
    console.log(error)
    return false
  }
}

async function removeAgente(id){
  try {
    const deleted = await db("agentes").where({id:id}).del()
    if(!deleted){
      console.log("Função removeAgente do agentesRepository não conseguiu remover o elemento")
      return false
    }
    return true

  } catch (error) {
    console.log(error)
    return false
  }
}

async function findAll() {
  try {
    const agentes = await db('agentes').select('*');
    return agentes;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = {
  addAgente,
  findAgente,
  updateAgente,
  removeAgente,
  findAll
};

