const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
  .select("*")
  .where({reservation_date: date})
  .orderBy("reservation_time", "asc");
}

function create(res) {
  return knex("reservations")
    .insert(res)
    .returning("*")
    .then((res) => res[0]);
}

module.exports = {
  list,
  create,
};
