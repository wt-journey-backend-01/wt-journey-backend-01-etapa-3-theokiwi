/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Apaga todos os casos
  await knex('casos').del();

  // Busca os IDs gerados dos agentes
  const agentes = await knex('agentes').select('id').orderBy('id');

  // Insere casos referenciando IDs válidos de agentes
  await knex('casos').insert([
    { titulo: 'Roubo no centro', descricao: 'Investigação de assalto a loja', status: 'aberto', agente_id: agentes[0].id },
    { titulo: 'Desaparecimento', descricao: 'Pessoa desaparecida na região norte', status: 'solucionado', agente_id: agentes[1].id },
    { titulo: 'Fraude bancária', descricao: 'Golpe envolvendo transferências online', status: 'aberto', agente_id: agentes[2].id }
  ]);
};
