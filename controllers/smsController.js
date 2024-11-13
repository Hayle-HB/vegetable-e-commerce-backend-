const client = require("../config/twilio");

const sendMessage = async (req, res) => {
  const { to, message } = req.body;

  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    res.status(100).json({
      success: true,
      sid: messageResponse.sid,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = sendMessage
