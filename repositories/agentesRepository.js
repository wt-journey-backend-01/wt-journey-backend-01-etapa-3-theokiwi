const db = require("../db/db.js")

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

async function findFiltered(filters) {
  const query = db('casos');

  if (filters.status) {
    query.where('status', filters.status);
  }

  if (
    filters.agente_id !== undefined &&
    !isNaN(filters.agente_id) &&
    Number.isInteger(filters.agente_id)
  ) {
    query.where('agente_id', filters.agente_id);
  }

  if (filters.search) {
    query.where(function() {
      this.where('titulo', 'ilike', `%${filters.search}%`)
          .orWhere('descricao', 'ilike', `%${filters.search}%`);
    });
  }

  return await query.select('*');
}

module.exports = {
  addAgente,
  findAgente,
  updateAgente,
  removeAgente,
  findAll,
  findFiltered
};

