/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Apaga todos os registros existentes
  await knex('agentes').del();

  // Insere agentes com IDs fixos
  await knex('agentes').insert([
    { id: 1, nome: 'Maria Silva', dataDeIncorporacao: '2024-05-01', cargo: 'Investigadora' },
    { id: 2, nome: 'João Souza', dataDeIncorporacao: '2023-09-15', cargo: 'Delegado' },
    { id: 3, nome: 'Ana Pereira', dataDeIncorporacao: '2022-11-20', cargo: 'Analista' }
  ]);
};
