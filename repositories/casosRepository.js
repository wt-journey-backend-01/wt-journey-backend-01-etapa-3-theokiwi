const db = require("../db/db")

async function addCaso(object){
  try {
    const created = await db("casos").insert(object, ["*"])
    return created

  } catch (error) {
    console.log(error)
    return false
  }
}

async function findCaso(id){
  try {
    const result = await db("casos").where({id: id})
    if(!result){
      console.log("Função findCaso do CasoRepository não encontrou um id equivalente ao pesquisado")
      return false
    }
    return result[0]

  } catch (error) {
    console.log(error)
    return false
  }
}

async function updateCaso(id, fieldsToUpdate){
  try {
    const updated = await db("casos").where({id:id}).update(fieldsToUpdate, ["*"])
    if(!result){
      console.log("Função updateCaso do CasoRepository não conseguiu atualizar o objeto")
    }
    return update[0]

  } catch (error) {
    console.log(error)
    return false
  }
}

async function removeCaso(id){
  try {
    const deleted = await db("casos").where({id:id}).del()
    if(!deleted){
      console.log("Função removeCaso do CasosRepository não conseguiu remover o elemento")
      return false
    }
    return true

  } catch (error) {
    console.log(error)
    return false
  }
}

