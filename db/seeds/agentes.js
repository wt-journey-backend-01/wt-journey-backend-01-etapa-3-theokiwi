/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('agentes').del();

  await knex('agentes').insert([
    { nome: 'Maria Silva', dataDeIncorporacao: '2024-05-01', cargo: 'Investigadora' },
    { nome: 'João Souza', dataDeIncorporacao: '2023-09-15', cargo: 'Delegado' },
    { nome: 'Ana Pereira', dataDeIncorporacao: '2022-11-20', cargo: 'Analista' }
  ]);
};
