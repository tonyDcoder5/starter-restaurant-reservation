/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:reservation_id").get(controller.read).all(methodNotAllowed);

// GET /reservations/:reservation_Id
// returns 200 for an existing id

module.exports = router;
