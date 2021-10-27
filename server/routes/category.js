const express = require("express");
const router = express.Router();

//middleware
const { authCheck, adminCheck } = require("../middlewares/auth");

//import
const {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} = require("../controllers/category");

//routes

router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", authCheck, adminCheck, read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subs/:_id", authCheck, adminCheck, getSubs);

module.exports = router;
