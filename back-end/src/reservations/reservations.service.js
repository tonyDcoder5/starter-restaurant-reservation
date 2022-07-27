const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
  .select("*")
  .where({reservation_date: date})
  .andWhereNot({status: "finished"})
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

async function update(data){
  return knex("reservations")
  .where("reservation_id", data.reservation_id)
  .update({status: data.status})
  .returning("*")
  .then((updatedRecords)=>updatedRecords[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
};


