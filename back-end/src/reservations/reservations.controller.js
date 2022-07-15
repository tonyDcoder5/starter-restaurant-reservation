const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.list();
  res.json({
    data
  });
}

async function create(req, res){
  const data = await service.create(req.body.data);

  return res.status(201).json({ data })
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

function verifyResTime(req, res, next){
  const {data: {reservation_time}={}} = req.body; 

  if(reservation_time === ""){
    return next({status: 400, message: "reservation_time"});
  }

  return next();

}

function verifyResDate(req, res, next){
  const {data: {reservation_date}={}} = req.body; 

  const date = new Date(reservation_date);
  const compare = new Date();

  if(reservation_date === ""){
    return next({status: 400, messsage: "reservation_date"})
  }

  return next();
}

function verifyPartyCount(req, res, next){
    const data = req.body.data;
    const people = parseInt(data.people);

    if (people <=0 || typeof people !== 'number')
    {
        return next({
            status: 400,
            message: `people`,
          });
    }
    return next();
}

function verifyMobile(req, res, next){
  const {data: {mobile_number}={}} = req.body; 

  if(mobile_number === ""){
    return next({status: 400, message: `mobile_number`});
  }

  return next();
}



module.exports = {
  list : [asyncErrorBoundary(list), ],
  create : [hasProp("first_name"), hasProp("last_name"), hasProp("mobile_number"),
  hasProp("reservation_date"), hasProp("reservation_time"), hasProp("people"),
  verifyPartyCount, verifyResDate, verifyResTime, verifyMobile, asyncErrorBoundary(create)],
};
// , 