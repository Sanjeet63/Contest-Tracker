import User from "../models/user.js";

export const googleAuth = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;

        const user = await User.findOneAndUpdate(
            { uid },
            { $set: { email, displayName, photoURL } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "User signed in", user });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
