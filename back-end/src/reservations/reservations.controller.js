const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { off } = require("../db/connection");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.list(req.query.date);

  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);

  return res.status(201).json({ data });
}

function anyLetters(str) {
  return /[a-zA-Z]/.test(str);
}

function hasProp(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName}` });
  };
}

function verifyResTime(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;

  if (reservation_time === "" || anyLetters(reservation_time)) {
    let time = reservation_time.replace(":", "");
    if (time >= 1030 && time <= 2130) {
      return next();
    } else {
      return next({ status: 400, message: "we closed, choose another time" });
    }

    return next({ status: 400, message: "reservation_time" });
  }

  return next();
}

const verifyResDate = (req, res, next) => {
  const { data: { reservation_date } = {} } = req.body;

  if (reservation_date && !anyLetters(reservation_date)) {
    const date = new Date(reservation_date);
    if (date.getDay() === 1) {
      next({ status: 400, message: "Sorry! We're closed on this day!" });
    }
    if (new Date() > date) {
      next({
        status: 400,
        message:
          "We do not serve the past, look to the future and choose another working date",
      });
    }
    return next();
  }
  return next({ status: 400, message: `reservation_date` });
};

function verifyPartyCount(req, res, next) {
  const { data: { people } = {} } = req.body;

  if (people && people > 0 && typeof people === "number") {
    return next();
  }
  next({
    status: 400,
    message: `people`,
  });
}

function verifyMobile(req, res, next) {
  const { data: { mobile_number } = {} } = req.body;

  if (mobile_number === "") {
    return next({ status: 400, message: `mobile_number` });
  }

  return next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProp("first_name"),
    hasProp("last_name"),
    hasProp("mobile_number"),
    hasProp("reservation_date"),
    hasProp("reservation_time"),
    hasProp("people"),
    verifyPartyCount,
    verifyResDate,
    verifyResTime,
    verifyMobile,
    asyncErrorBoundary(create),
  ],
};
