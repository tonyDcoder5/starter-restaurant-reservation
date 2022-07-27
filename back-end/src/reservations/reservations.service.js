const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
  .select("*")
  .where({reservation_date: date})
  .andWhereNot({status: "finished"})
  .orderBy("reservation_time", "asc");
}

function create(res) {
  return knex("reservations").insert(res).returning("*").then((data)=> data[0]);
}

function read(reservation_id){
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(data){
  return knex("reservations")
  .where("reservation_id", data.reservation_id)
  .update({status: data.status})
  .returning("*")
  .then((updatedRecords)=>updatedRecords[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  update,
  search,
};


