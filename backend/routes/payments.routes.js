const express = require("express");
const {capturePayment, verifySignature} = require("../controllers/Payments.Controller")
const {auth, isStudent} = require("../middlewares/auth")

const router = express.Router();

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/capturePayment", verifySignature);

module.exports = router;