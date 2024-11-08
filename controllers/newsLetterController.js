const Subscribers = require("../models/Subscriber.js");
const transporter = require("../config/transporter.js");

const sendNewsLetter = async (req, res) => {
  const { fromEmail, subject, toEmail, message } = req.body;

  try {
    // Call helper function to send email to a single recipient
    const result = await helper_to_send_to_a_single_email_user({
      fromEmail,
      subject,
      toEmail,
      message,
    });

    // Check if the email was successfully sent and respond accordingly
    if (result.success) {
      res.status(200).json({
        message: `Newsletter sent successfully to ${toEmail}`,
        result,
      });
    } else {
      res.status(500).json({
        message: `Failed to send newsletter to ${toEmail}`,
        error: result.error,
      });
    }
  } catch (err) {
    console.log(`Error sending newsletter to ${toEmail}:`, err);
    res.status(500).json({
      message: "An error occurred while sending the newsletter",
      error: err.message,
    });
  }
};

// Helper function to send a newsletter to a single subscriber
const helper_to_send_to_a_single_email_user = async ({
  fromEmail,
  subject,
  toEmail,
  message,
}) => {
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Newsletter sent to ${toEmail}:`, info.messageId);
    return { success: true, toEmail, messageId: info.messageId };
  } catch (err) {
    console.log(`Error sending newsletter to ${toEmail}:`, err);
    return { success: false, toEmail, error: err.message };
  }
};

// Function to send the newsletter to all subscribers concurrently
const sendNewsLetterForAll = async (req, res) => {
  const { fromEmail, subject, message } = req.body;

  try {
    const subscribers = await Subscribers.find();

    // Map email promises
    const emailPromises = subscribers.map((subscriber) =>
      helper_to_send_to_a_single_email_user({
        fromEmail,
        subject,
        toEmail: subscriber.email, // Use each subscriber's email
        message,
      })
    );

    // Use Promise.all to run all email promises concurrently
    const results = await Promise.all(emailPromises);

    // Analyze results for overall success/failure
    const successCount = results.filter((result) => result.success).length;
    const failureCount = results.length - successCount;

    console.log(
      `Total Success: ${successCount}, Total Failures: ${failureCount}`
    );

    res.status(200).json({
      message: "Newsletter process completed",
      successCount,
      failureCount,
      details: results,
    });
  } catch (err) {
    console.log("Error retrieving subscribers or sending emails:", err);
    res.status(500).json({
      message: "Error occurred while sending newsletters",
      error: err.message,
    });
  }
};

module.exports = { sendNewsLetter, sendNewsLetterForAll };
