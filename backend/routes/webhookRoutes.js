import express from "express";
import { Webhook } from "svix";
import Provider from "../models/Provider.js";
import User from "../models/User.js";

const router = express.Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error("❌ CLERK_WEBHOOK_SECRET is not set in .env");
        return res.status(500).json({ error: "Webhook secret missing" });
      }

      const payload = req.body.toString("utf8");
      const headers = req.headers;

      const svix_id = headers["svix-id"];
      const svix_timestamp = headers["svix-timestamp"];
      const svix_signature = headers["svix-signature"];

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: "Missing svix headers" });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      let evt;

      try {
        evt = wh.verify(payload, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: "Webhook signature verification failed" });
      }

      const eventType = evt.type;
      console.log(`🔥 WEBHOOK RECEIVED: ${eventType}`);

      // ✅ USER CREATED
      if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "";

        await User.create({
          clerkUserId: id,
          email,
          firstName: first_name || "",
          lastName: last_name || "",
          imageUrl: image_url || "",
        });
        console.log(`✅ User ${id} saved to MongoDB`);
      }

      // ✅ USER UPDATED
      if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "";

        await User.findOneAndUpdate(
          { clerkUserId: id },
          {
            email,
            firstName: first_name || "",
            lastName: last_name || "",
            imageUrl: image_url || "",
          },
          { new: true }
        );
        console.log(`✅ User ${id} updated in MongoDB`);
      }

      // ✅ USER DELETED
      if (eventType === "user.deleted") {
        const clerkUserId = evt.data.id;
        
        // Delete from normal User collection
        await User.findOneAndDelete({ clerkUserId });
        console.log(`✅ User ${clerkUserId} deleted from MongoDB Users`);

        // Also delete from Provider collection if they are a provider
        await Provider.deleteMany({ clerkUserId });
        console.log(`✅ Provider(s) for user ${clerkUserId} deleted from DB`);
      }

      res.json({ success: true });
    } catch (err) {
      console.error("❌ WEBHOOK ERROR:", err);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);

export default router;