import User from "../models/user.model.js";


const getAdminDashboard = async (req, res) => {
    try {
        // const users = await User.find().select("-geminiApiKey");
        const users=await User.find();
        return res.status(200).json({ message: "Admin dashboard data", users });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load admin dashboard", error });
    }
};

export  { getAdminDashboard };

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user", error });
    }
};

export { deleteUser };

const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateData = req.body;
        // const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-geminiApiKey");
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update user", error });
    }
};

export { updateUser };


