const express = require("express");
const { bookDemo } = require("../controllers/demoController");

const router = express.Router();

router.post("/book", bookDemo);

module.exports = router;
