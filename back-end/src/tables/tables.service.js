const knex = require("../db/connection");

function list() {
  return "test list";
//   knex("tables")
//   .select("*").orderBy("table_name", "asc");
}

async function create(table) {
  const data = await knex("tables")
    .insert(table)
    .returning("*");
  return "create table test";
  data[0];
}

module.exports = {
  list,
  create,
};
