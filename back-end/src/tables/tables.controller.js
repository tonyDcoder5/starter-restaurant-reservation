const service = require("./tables.service");
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



module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(create),
  ],
};