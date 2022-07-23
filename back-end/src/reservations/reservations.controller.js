const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);

  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

function read(req, res) {
  const data= res.locals.reservation;

  res.json({ data });
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
};
