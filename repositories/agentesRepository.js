const db = require("../db/db.js")

async function addAgente(object){
  try {
    const created = await db("agentes").insert(object, ["*"]);
    return created && created.length > 0 ? created[0] : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findAgente(id){
  try {
    const result = await db("agentes").where({id: id});
    if (!result || result.length === 0) {
      console.log("Função findAgente do agenteRepository não encontrou um id equivalente ao pesquisado");
      return false;
    }
    return result[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateAgente(id, fieldsToUpdate){
  try {
    const updated = await db("agentes").where({id:id}).update(fieldsToUpdate, ["*"]);
    if (!updated || updated.length === 0) {
      console.log("Função updateAgente do agenteRepository não conseguiu atualizar o objeto");
      return false;
    }
    return updated[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function removeAgente(id){
  try {
    const deleted = await db("agentes").where({id:id}).del();
    if (!deleted) {
      console.log("Função removeAgente do agentesRepository não conseguiu remover o elemento");
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Filtragem e ordenação direto no banco
async function findAll(filters = {}) {
  try {
    const query = db('agentes');

    if (filters.cargo) {
      query.where('cargo', filters.cargo);
    }

    if (filters.sort) {
      const direction = filters.sort.startsWith('-') ? 'desc' : 'asc';
      const column = filters.sort.replace('-', '');
      if (column === 'dataDeIncorporacao') {
        query.orderBy(column, direction);
      }
    }

    return await query.select('*');
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

