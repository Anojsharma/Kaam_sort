import Provider from "../models/Provider.js";

// ✅ CREATE
export const createProvider = async (req, res, next) => {
  try {
    console.log("📥 Received body:", JSON.stringify(req.body, null, 2));

    const {
      clerkUserId,
      name,
      phone,
      category,
      experience,
      price,
      location,
      about,
      image,
    } = req.body;

    // Check each required field individually for better error messages
    const missingFields = [];
    if (!clerkUserId) missingFields.push("clerkUserId");
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!category) missingFields.push("category");
    if (!experience && experience !== 0) missingFields.push("experience");
    if (!price && price !== 0) missingFields.push("price");
    if (!location) missingFields.push("location");

    if (missingFields.length > 0) {
      console.error("❌ Missing fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const exists = await Provider.findOne({ clerkUserId });

    if (exists) {
      console.error("❌ Provider already exists for clerkUserId:", clerkUserId);
      return res.status(400).json({ success: false, message: "Provider already exists for this account" });
    }

    const provider = await Provider.create({
      clerkUserId,
      name,
      phone,
      category,
      experience: Number(experience),
      price: Number(price),
      location,
      about: about || "",
      image: image || "",
    });

    console.log("✅ Provider created:", provider._id);
    res.status(201).json(provider);
  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    next(err);
  }
};

// ✅ GET ALL
export const getAllProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    console.error("❌ GET ALL ERROR:", err);
    next(err);
  }
};

// ✅ GET ONE
export const getProviderByClerkId = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({
      clerkUserId: req.params.clerkUserId,
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json(provider);
  } catch (err) {
    console.error("❌ GET ONE ERROR:", err);
    next(err);
  }
};

// ✅ UPDATE PROFILE
export const updateProviderProfile = async (req, res, next) => {
  try {
    const { clerkUserId } = req.params;

    const provider = await Provider.findOneAndUpdate(
      { clerkUserId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json(provider);
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err);
    next(err);
  }
};

// ✅ DELETE (MANUAL)
export const deleteProviderByClerkId = async (req, res, next) => {
  try {
    const provider = await Provider.findOneAndDelete({
      clerkUserId: req.params.clerkUserId,
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json({ success: true, message: "Provider deleted" });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    next(err);
  }
};