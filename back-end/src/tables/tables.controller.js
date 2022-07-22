const service = require("./tables.service");
const resService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const data = await service.list();

  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

function read(req, res) {
  const {table: data} = res.locals;

  res.json({ data });
}

async function update(req, res) {
  const editTable = {
    ...res.locals.table,
    reservation_id: req.body.data.reservation_id,
  };
  
  await service.update(editTable);
  const updateTable = await service.read(editTable.table_id);
  res.json({ data: updateTable });
}

async function tableExists(req, res, next) {
  const {table_id} = req.params; 
  
  const table = await service.read(table_id);
  
    if (table) {
    res.locals.table = table;
    return next();
  }

  next({ status: 404, message: `table_id: ${table_id} does not exist` });
}

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

function verifyCapacity(capacity) {
  if (capacity && typeof capacity === "number" && capacity > 0) {
    return true;
  }
  return false;
}

function verifyTableName(name) {
  if (!name || name.length < 2) {
    return false;
  }

  if (name) {
    return true;
  }
}


async function verifyUpdate(req, res, next){
  let table = res.locals.table;
  let data = req.body.data;

  if(!data)
  {
    next({status: 400, message: `data invalid`})
  }
  
  if(!req.body.data.reservation_id)
  {
    next({status: 400, message: `reservation_id ${req.body.data.reservation_id}`})
  }

  let reservation = await resService.read(req.body.data.reservation_id);

  if(!reservation)
  {
    next({status: 404, message: `reservation_id ${req.body.data.reservation_id}`})
  }



  if(table.reservation_id){
    next({status:400, message: `Table is occupied`});
  }

  if(table.capacity < reservation.people)
  {
    next({status: 400, message: `table does not have sufficient capacity`});
  }

  next();
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [verifyTable, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [asyncErrorBoundary(tableExists), asyncErrorBoundary(verifyUpdate), asyncErrorBoundary(update)]
};
