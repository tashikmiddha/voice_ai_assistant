import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userID=req.userID;
        const user=await User.findById(userID);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getCurrentUser controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const saveAssistant=async (req, res)=>{
    try {
        const { assistantName,businessName,businessType,businessDescription,tone,theme,geminiApiKey,pages, } = req.body;
        const user=await User.findById(req.userID);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        user.assistantName=assistantName;
        user.businessName=businessName;
        user.businessType=businessType;
        user.businessDescription=businessDescription;
        user.tone=tone;
        user.theme=theme;
        if(geminiApiKey){
            user.geminiApiKey=geminiApiKey;
        }
        user.geminiStatus="active";
        user.pages=pages||[];
        user.isSetupComplete=true;
        await user.save();
        return res.status(200).json({ message: "Assistant saved successfully",user });
    } catch (error) {
        console.error("Error in saveAssistant controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};