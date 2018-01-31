var express = require("express");
var router = express.Router();

var ctrl = require("../controllers/products-controller");

router.get("/", ctrl.all);
router.get("/totalcost", ctrl.totalcost);
router.get("/totalearnings", ctrl.totalearnings);
router.get("/:id", ctrl.one);
router.get("/:id/cost", ctrl.cost);
router.get("/:id/earnings", ctrl.earnings);
router.get("/:id/convertcurrency/:cur", ctrl.convertcurrency);
router.post("/",  ctrl.save);
router.put("/:id",  ctrl.update);
router.delete("/:id", ctrl.delete);


module.exports = router;