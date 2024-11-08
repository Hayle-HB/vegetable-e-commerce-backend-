const router = require("express").Router();
const {
  sendNewsLetter,
  sendNewsLetterForAll,
} = require("../controllers/newsLetterController.js");

router.post("/send-newsletter", sendNewsLetter);
router.post("/send-newsletter-all", sendNewsLetterForAll);

module.exports = router;
