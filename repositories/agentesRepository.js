const db = require("../db/db.js");

async function addAgente(object){
  try {
    const [created] = await db("agentes").insert(object).returning('*');
    return created || false;
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
    const [updated] = await db("agentes").where({id:id}).update(fieldsToUpdate).returning('*');
    if (!updated) {
      console.log("Função updateAgente do agenteRepository não conseguiu atualizar o objeto");
      return false;
    }
    return updated;
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

// Função correta para filtrar agentes
async function findAll(filters = {}) {
  try {
    const query = db('agentes');

    if (filters.cargo) {
      query.where('cargo', filters.cargo);
    }

    if (filters.sort) {
      const direction = filters.sort.startsWith('-') ? 'desc' : 'asc';
      const column = filters.sort.replace('-', '');
      // Permita ordenar por campos válidos
      if (['id', 'nome', 'cargo', 'dataDeIncorporacao'].includes(column)) {
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
