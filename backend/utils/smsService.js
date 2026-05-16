import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log("✅ Twilio Client Initialized");
  } catch (error) {
    console.error("❌ Twilio Initialization Error:", error);
  }
} else {
  console.log("⚠️ Twilio credentials missing. SMS will be logged to console instead.");
}

export const sendSMS = async (to, body) => {
  if (client && twilioPhone) {
    try {
      const payload = {
        body,
        to,
      };

      if (twilioPhone.startsWith("MG")) {
        payload.messagingServiceSid = twilioPhone;
      } else {
        payload.from = twilioPhone;
      }

      const message = await client.messages.create(payload);
      console.log(`✅ SMS sent to ${to}: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error(`❌ Failed to send SMS to ${to}:`, error);
      throw error;
    }
  } else {
    // Fallback for local testing when Twilio is not configured
    console.log(`\n================ SIMULATED SMS ================`);
    console.log(`To: ${to}`);
    console.log(`Body: ${body}`);
    console.log(`===============================================\n`);
    return { success: true, simulated: true };
  }
};
