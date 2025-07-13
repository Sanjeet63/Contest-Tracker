import User from "../models/user.js";

export const googleAuth = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;
        let user = await User.findOne({ uid });

        if (user) {
            user.displayName = displayName;
            user.photoURL = photoURL;
            await user.save();
        } else {
            user = await User.create({ uid, email, displayName, photoURL });
        }

        res.status(200).json({ message: "User signed in", user });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
