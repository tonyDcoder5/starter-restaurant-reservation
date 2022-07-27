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

async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

function read(req, res) {
  const data= res.locals.reservation;

  res.json({ data });
}

async function update(req, res) {
  const editRes = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  
  await service.update(editRes);
  const updateRes = await service.read(editRes.reservation_id);
  res.status(200).json({ data: updateRes });
}

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

  return next({status: 400, message: `status: ${reservation.status} is unknown/invalid try again`})
  
}

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

function verifyResTime(time) {
  let timeFormat = /\d\d:\d\d/;

  if (time !== "" && timeFormat.test(time)) {
    let rawTime = time.replace(":", "");
    if (rawTime >= 1030 && rawTime <= 2130) {
      return true;
    } else {
      return false;
    }
  }
}

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

function verifyPartyCount(people) {
  if (people && typeof people === "number" && people > 0) {
    return true;
  }
  return false;
}

function verifyMobile(mobile) {
  return mobile ? true : false;
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [verifyRes, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(resExists), read],
  update: [verifyUpdateStatus, asyncErrorBoundary(resExists), verifyStatus, asyncErrorBoundary(update)],
};
