/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Apaga todos os casos
  await knex('casos').del();

  // Insere casos referenciando IDs válidos de agentes
  await knex('casos').insert([
    { titulo: 'Roubo no centro', descricao: 'Investigação de assalto a loja', status: 'aberto', agente_id: 1 },
    { titulo: 'Desaparecimento', descricao: 'Pessoa desaparecida na região norte', status: 'solucionado', agente_id: 2 },
    { titulo: 'Fraude bancária', descricao: 'Golpe envolvendo transferências online', status: 'aberto', agente_id: 3 }
  ]);
};
