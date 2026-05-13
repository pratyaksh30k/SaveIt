const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect.middleware.js");
const itemController = require("../controllers/item.controller.js");

router.use(protect);

router.post("/", itemController.saveNewItem);
router.get("/", itemController.getAllItems);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
