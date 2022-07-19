const knex = require("../db/connection");

let tables = [
{table_id: "1", table_name: "test 1", capacity: "6", status: "seated"}, 
{table_id: "2", table_name: "test 2", capacity: "6", status: ""}, 
{table_id: "3", table_name: "test 3", capacity: "1", status: ""}, 
{table_id: "4", table_name: "test 4", capacity: "1", status: "seated"}, 
]

function list() {
  return tables;
  //knex("tables").select("*").orderBy("table_name");
}

async function create(table) {
  const data = await knex("tables").insert(table).returning("*");
  return data[0];
}

module.exports = {
  list,
  create,
};
