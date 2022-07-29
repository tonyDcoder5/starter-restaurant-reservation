const service = require("./tables.service");
const resService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");

/**
 * List handler for table resources
 */
async function list(req, res) {
  const data = await service.list();

  res.json({
    data,
  });
}

// create new table database call
async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

// read table reservastion database call
function read(req, res) {
  const {table: data} = res.locals;

  res.json({ data });
}

// update table reservastion database call
async function update(req, res) {
  const editTable = {
    ...res.locals.table,
    reservation_id: req.body.data.reservation_id,
    status: "seated",
  };
  
  await service.update(editTable);
  const updateTable = await service.read(editTable.table_id);
  res.json({ data: updateTable });
}

// finish table reservastion database call
async function finish(req, res) {
  const editTable = {
    ...res.locals.table,
    reservation_id: null,
    status: "Free",
  };
  const editRes = {
    ...res.locals.reservation,
    status: "finished",
  }
  await service.finish(editTable, editRes);
  res.status(200).json({editTable});
}

// middleware function stores a valid table in res.locals, or returns an error if table_id does not exist
async function tableExists(req, res, next) {
  const {table_id} = req.params; 
  
  const table = await service.read(table_id);
  
    if (table) {
    res.locals.table = table;
    return next();
  }

  return next({ status: 404, message: `table_id: ${table_id} does not exist` });
}

// middleware function returns first index from array of error if user requested update data does not pass any table property validations
function verifyTable(req, res, next) {
  const table = req.body.data;
  let errors = [];
  let message = "";

  if (!table) {
    message = `Invalid table.`;
    errors.push(message);
    return next({ status: 400, message: errors[0] });
  }

  let props = ["table_name", "capacity"];

  props.forEach((prop) => {
    if (!table[prop]) {
      message = `Table missing ${prop}, try again`;
      errors.push(message);
    }
  });

  if (!verifyCapacity(table.capacity)) {
    message = `Invalid capacity entry, please try again with valid number`;
    errors.push(message);
  }

  if (!verifyTableName(table.table_name)) {
    message = `Invalid table_name entry, please try again with valid name`;
    errors.push(message);
  }

  if (errors.length > 0) {
    return next({ status: 400, message: errors[0] });
  }

  return next();
}

// returns boolean for capacity property validation
function verifyCapacity(capacity) {
  if (capacity && typeof capacity === "number" && capacity > 0) {
    return true;
  }
  return false;
}

// returns boolean for table_name property validation
function verifyTableName(name) {
  if (!name || name.length < 2) {
    return false;
  }

  if (name) {
    return true;
  }
}

// middleware function to check user requested update data for necessary properties, as well as to check that table is not occupied
// and that the reservation being seated is valid 
async function verifyUpdate(req, res, next){
  let table = res.locals.table;
  let data = req.body.data;

  if(!data)
  {
    return next({status: 400, message: `data invalid`})
  }
  
  if(!req.body.data.reservation_id)
  {
    return next({status: 400, message: `reservation_id ${req.body.data.reservation_id}`})
  }

  let reservation = await resService.read(req.body.data.reservation_id);

  if(!reservation)
  {
    return next({status: 404, message: `reservation_id ${req.body.data.reservation_id}`})
  }

  if(reservation.status === "seated"){
    return next({status: 400, message: `reservation ${reservation.reservation_id} already seated!`})
  }

  if(reservation.status === "finished"){
    return next({status: 400, message: `reservation ${reservation.reservation_id} already finished!`})
  }

  if(table.reservation_id){
    return next({status:400, message: `Table is occupied!`});
  }

  if(table.capacity < reservation.people)
  {
    return next({status: 400, message: `table does not have sufficient capacity`});
  }

  return next();
}

// middleware function checks table in database for reservation_id in order to check for and store a valid reservation in res.locals
async function verifyFinish(req, res, next){
  let table = res.locals.table;

  if(!table.reservation_id)
  {
    return next({status: 400, message: `Table ${table.table_id} is not occupied`})
  }

  let reservation = await resService.read(table.reservation_id);
  if(!reservation){
    return next({status: 404, message: `reservation_id ${table.reservation_id}`})
  }
  res.locals.reservation = reservation;
  return next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [verifyTable, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(verifyUpdate), asyncErrorBoundary(update)],
  finish: [asyncErrorBoundary(tableExists), asyncErrorBoundary(verifyFinish), asyncErrorBoundary(finish)],
};
