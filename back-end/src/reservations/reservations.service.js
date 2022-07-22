const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
  .select("*")
  .where({reservation_date: date})
  .orderBy("reservation_time", "asc");
}

async function create(res) {
  const res_1 = await knex("reservations")
    .insert(res)
    .returning("*");
    
  return res_1[0];
}

function read(reservation_id){
  return knex("reservations").select("*").where({ reservation_id }).first();
}

module.exports = {
  list,
  create,
  read,
};


