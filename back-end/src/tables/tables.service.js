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

async function update(data) {
  
  return knex.transaction(async (trx )=> {
    const table = await knex("tables")
        .where("table_id", data.table_id)
        .update(data)
        .returning("*")
        .transacting(trx)
        .then((updatedRecords) => updatedRecords[0])
    
    await knex("reservations")
        .where("reservation_id", data.reservation_id)
        .update({status: data.status})
        .returning("*")
        .transacting(trx)
        .then((updatedRecords)=>updatedRecords[0])
        
    return table
})    
}

async function finish(data, reservation) {
  return knex.transaction(async (trx)=> {
            
    const table = await knex("tables")
        .where("table_id", data.table_id)
        .update(data)
        .returning("*")
        .transacting(trx)
        .then((updatedRecords) => updatedRecords[0])
    
    await knex("reservations")
        .where("reservation_id", reservation.reservation_id)
        .update(reservation)
        .returning("*")
        .transacting(trx)
        .then((updatedRecords)=>updatedRecords[0])
        
    return table
})    
}

module.exports = {
  list,
  create,
  read,
  update,
  finish,
};
