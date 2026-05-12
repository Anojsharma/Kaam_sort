import User from "../models/User.js";

export const syncUser = async (req, res, next) => {
  try {
    const { clerkUserId, email, firstName, lastName, imageUrl } = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        imageUrl: imageUrl || "",
      });
      console.log(`✅ User ${clerkUserId} synced/created in MongoDB`);
    } else {
      user = await User.findOneAndUpdate(
        { clerkUserId },
        { 
          email, 
          firstName: firstName || user.firstName, 
          lastName: lastName || user.lastName, 
          imageUrl: imageUrl || user.imageUrl 
        },
        { new: true }
      );
      console.log(`✅ User ${clerkUserId} synced/updated in MongoDB`);
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ SYNC USER ERROR:", err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { clerkUserId } = req.params;

    if (!clerkUserId) {
      return res.status(400).json({ success: false, message: "Missing clerkUserId" });
    }

    const user = await User.findOneAndDelete({ clerkUserId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`✅ User ${clerkUserId} deleted from MongoDB`);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE USER ERROR:", err);
    next(err);
  }
};

