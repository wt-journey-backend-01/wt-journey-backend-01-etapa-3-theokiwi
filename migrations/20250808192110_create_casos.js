/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable("casos", (table) => {
    table.increments("id").primary();
    table.string("titulo", 120).notNullable();
    table.string("descricao", 250).notNullable();
    table.enu("status", ["aberto", "solucionado"], {
      useNative: true,
      enumName: "status_caso",
    }).notNullable();
    table.integer("agente_id").unsigned().notNullable().references("id").inTable("agentes").onDelete("CASCADE");
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("casos");
  await knex.raw(`DROP TYPE IF EXISTS status_caso`);
};