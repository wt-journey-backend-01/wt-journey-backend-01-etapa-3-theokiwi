/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('casos').del();

  await knex('casos').insert([
    { titulo: 'Caso Alpha', descricao: 'Descrição do caso Alpha', status: 'aberto', agente_id: 1 },
    { titulo: 'Caso Beta', descricao: 'Descrição do caso Beta', status: 'solucionado', agente_id: 2 }
  ]);
};
