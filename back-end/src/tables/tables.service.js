const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

async function create(table) {
  const data = await knex("tables").insert(table).returning("*");
  return data[0];
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

async function update(table) {
  return knex("tables")
    .select("*")
    .where({ table_id: table.table_id })
    .update(table, "*")
    .then((data)=> data[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
};
