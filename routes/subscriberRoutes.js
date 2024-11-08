const router = require("express").Router();

const {
  getSubscriberByID,
  getSubscribers,
  subscriberRegister,
  deleteSubscriber,
} = require("../controllers/subscriberController.js");

router.get("/subscribers", getSubscribers);
router.get("/subscribers/:id", getSubscriberByID);
router.post("/subscribers", subscriberRegister);
router.delete("/subscribers/:id", deleteSubscriber);

module.exports = router;
