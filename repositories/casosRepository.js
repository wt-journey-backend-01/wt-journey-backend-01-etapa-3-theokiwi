const db = require("../db/db")

async function addCaso(object){
  try {
    const created = await db("casos").insert(object, ["*"]);
    return created && created.length > 0 ? created[0] : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findCaso(id){
  try {
    const result = await db("casos").where({id: id});
    if (!result || result.length === 0) {
      console.log("Função findCaso do CasoRepository não encontrou um id equivalente ao pesquisado");
      return false;
    }
    return result[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateCaso(id, fieldsToUpdate){
  try {
    const updated = await db("casos").where({id:id}).update(fieldsToUpdate, ["*"]);
    if (!updated || updated.length === 0) {
      console.log("Função updateCaso do CasoRepository não conseguiu atualizar o objeto");
      return false;
    }
    return updated[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function removeCaso(id){
  try {
    const deleted = await db("casos").where({id:id}).del();
    if (!deleted) {
      console.log("Função removeCaso do CasosRepository não conseguiu remover o elemento");
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Corrigido: filtros e ordenação válidos para casos
async function findAll() {
  try {
    return await db('casos').select('*');
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

  if (filters.agente_id) {
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
  addCaso,
  findCaso,
  updateCaso,
  removeCaso,
  findAll,
  findFiltered
};

