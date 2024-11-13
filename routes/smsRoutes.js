const router = require('express').Router();
const smsController = require('../controllers/smsController.js')

router.post('/send-sms', smsController);



module.exports = router;