const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  }
}


// create handler for creating new reservations in database
async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

// read handler for retrieving a specific reservation from database
function read(req, res) {
  const data= res.locals.reservation;

  res.json({ data });
}

// update handler for updating status of a specific reservation from database
async function update(req, res) {
  const editRes = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  
  await service.update(editRes);
  const updateRes = await service.read(editRes.reservation_id);
  res.status(200).json({ data: updateRes });
}

// edit handler for editing any property of a specific reservation in database
async function edit(req, res) {
  const editRes = {
    ...req.body.data,
  };
  await service.edit(editRes, req.params.reservation_id);
  const updateRes = await service.read(req.params.reservation_id);
  res.status(200).json({ data: updateRes });
}

// check for specific reservation id and store current state in res.locals
async function resExists(req, res, next) {
  const {reservation_id} = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {   
    res.locals.reservation = reservation;
    return next();
  }
  else{
  return next({ status: 404, message: `${reservation_id} reservation cannot be found.` });
  }
} 
  
// checks status property of reservation in database to make sure it is valid before update
function verifyStatus(req, res, next){
  let statuses = ["booked", "seated", "finished", "cancelled"];
  let reservation = res.locals.reservation;

    if(reservation.status === statuses[0]){
      return next();
    }
    if(reservation.status === statuses[1]){
      return next();
    }
    if(reservation.status === statuses[2]){
      return next({status: 400, message: `reservation is already finished, cannot update finished reservation ${reservation.reservation_id}`});
    }
    if(reservation.status === statuses[3]){
      return next({status: 400, message: `reservation is already cancelled, cannot update cancelled reservation ${reservation.reservation_id}`});
    }

  return next({status: 400, message: `status: ${reservation.status} is unknown/invalid try again`})
  
}

// checks the status being updated to make sure it is valid before updating reservation property in database
function verifyUpdateStatus(req, res, next){
  let update = req.body.data.status;
  let statuses = ["booked", "seated", "finished", "cancelled"];

  if(!update){
    return next({status: 400, message: `reservation status: ${update} invalid/undefined, try again`})
  }

  if(!statuses.includes(update)){
    return next({status: 400, message: `reservation status: ${update} invalid/undefined, try again`})
  }

  return next();
}

// checks reservation object required properties and runs helper functions for certain edge cases, can compile error messages to display as an array on FE 
// currently only returns first error in order to pass tests
function verifyRes(req, res, next) {
  const reservation = req.body.data;
  let errors = [];
  let message = "";
  if (!reservation) {
    message = `Invalid reservation.`;
    errors.push(message);
    return next({ status: 400, message: errors[0] });
  }

  let props = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  props.forEach((prop) => {
    if (!reservation[prop]) {
      message = `Reservation missing ${prop}, try again`;
      errors.push(message);
    }
  });

  if (!verifyMobile(reservation.mobile_number)) {
    message = `Reservation missing mobile_number`;
    errors.push(message);
  }

  if (!verifyPartyCount(reservation.people)) {
    message = `Invalid people entry, please try again with valid number`;
    errors.push(message);
  }

  if (verifyResDate(reservation.reservation_date)) {
    let message = verifyResDate(reservation.reservation_date);
    errors.push(...message);
  }

  if (!verifyResTime(reservation.reservation_time)) {
    message = `reservation_time outside of business hours/invalid`;
    errors.push(message);
  }

  if(reservation.status !== "booked"){
    if(reservation.status === "seated"){
      message = `reservation is already seated`
      errors.push(message);
    }
    else if(reservation.status === "finished"){
      message = `reservation is already finished`
      errors.push(message);
    }
  }

  if (errors.length > 0) {
    return next({ status: 400, message: errors[0] });
  }

  return next();
}

// helper function checks reservation_time property for valid entry
function verifyResTime(time) {
  let timeFormat = /\d\d:\d\d/;
 
  if (time && time !== "" && timeFormat.test(time)) {
    let resTime = time.split(":")
    resTime = parseInt(resTime[0] + resTime[1]);
    if (resTime >= 1030 && resTime <= 2130) {
      return true;
    } 
    return false;
  }
  return false;
}

// helper function checks reservation_date property for valid entry
function verifyResDate(date) {
  let messages = [];
  let message = "";
  let dateFormat = /\d\d\d\d-\d\d-\d\d/;

  if (date && dateFormat.test(date)) {
    const check = new Date(date);

    if (check.getDay() === 1) {
      message = "Sorry! We're closed on this day!";
      messages.push(message);
    }
    if (new Date() > check) {
      message =
        "We do not serve the past, look to the future and choose another working date";
      messages.push(message);
    }

    if (messages.length > 0) {
      return messages;
    }

    return false;
  }

  message = "Missing reservation_date, please try again";
  messages.push(message);

  return messages;
}

// helper function checks people property for valid entry 
function verifyPartyCount(people) {
  if (people && typeof people === "number" && people > 0) {
    return true;
  }
  return false;
}

// helper function checks mobile_number property for valid entry
function verifyMobile(mobile) {
  return mobile ? true : false;
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [verifyRes, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(resExists), read],
  update: [verifyUpdateStatus, asyncErrorBoundary(resExists), verifyStatus, asyncErrorBoundary(update)],
  edit: [asyncErrorBoundary(resExists), verifyRes, asyncErrorBoundary(edit)]
};
