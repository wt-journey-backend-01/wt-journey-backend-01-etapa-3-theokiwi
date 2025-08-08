/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("agentes", (table) => {
    table.increments("id").primary();
    table.string("nome", 40).notNullable();
    table.date("dataDeIncorporacao").notNullable();
    table.string("cargo", 120).notNullable();
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("agentes");
};