import User from "../models/user.model.js";
import { generateGeminiResponse } from "../config/gemini.js";

export const getAssistantConfig = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-geminiApiKey");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message:"Assistant config data" ,user });
  } catch (error) {
    return res.status(500).json({ message:"Assistant config failed", error });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const body = req.body || {};
    const userId = req.params.userId || body.userId;
    const message = String(body.message || body.question || "").trim();

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.geminiApiKey) {
      return res.status(400).json({ success: false, message: "Gemini API key not configured" });
    }
    if (user.plan === "free" && user.totalMessages >= user.requestLimit) {
      return res.status(403).json({ success: false, message: "Request limit reached. Please upgrade your plan." });
    }
    if (user.plan === "pro" && user.proExpiresAt && new Date() >= user.proExpiresAt) {
      user.plan = "free";
      await user.save();
      return res.status(403).json({ success: false, message: "Subscription expired. Please renew your subscription." });
    }   
    const cleanedMessage = message.toLowerCase();
   
    if (user.enableNavigation) {
      const navigationWords = ["navigate", "go to", "open", "visit", "show me", "take me to"];
      const wantsNavigation = navigationWords.some((word) => cleanedMessage.startsWith(word));

      if (wantsNavigation) {
        const matchedPage = (user.pages || []).find((page) =>
          [page.name, page.path, ...(page.keywords || [])]
            .filter(Boolean)
            .some((keyword) => cleanedMessage.includes(String(keyword).toLowerCase()))
        );

        if (!matchedPage) {
          return res.status(404).json({ success: false, message: "No matching page found for navigation" });
        }
        if (body.currentPath === matchedPage.path) {
          return res.status(200).json({ success: true, answer: "already on page" });
        }
        return res.json({ success: true, action: "navigate", path: matchedPage.path, response: `Opening ${matchedPage.name}` });
      }
    }
   
    const prompt = `
 You are ${user.assistantName || "the assistant"}, a virtual assistant for ${user.businessName || "this website"}, a ${user.businessType || "business"} business. Your purpose is to assist users with inquiries related to ${user.businessDescription || "the website"}.
 Your tone is ${user.tone || "friendly"} and the website theme is ${user.theme || "dark"}.
Rules:
-keep replies  under 15 words.
-give fast direct responses without unnecessary elaboration.
-talk normally like a human, avoid sounding like an AI.
-behave like smart voice assistant, not like a chatbot.
-avoid long explanations, get straight to the point.
-keep responses short and easy to understand.
-reply in English.

 Answer the following question from the user in a ${user.tone || "friendly"} manner: ${message}
 `;
    const aiResponse = await generateGeminiResponse(prompt, user.geminiApiKey, user);
    if (user.plan === "free") {
      user.totalMessages += 1;
      await user.save();
    }
    return res.status(200).json({ success: true, aiResponse });

  } catch (error) {
    console.error("Error in askAssistant controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to get assistant response",
    });
  }
};
