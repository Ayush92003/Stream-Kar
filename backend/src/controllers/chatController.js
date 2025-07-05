import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.json({ token });
    } catch (error) {
        console.error("Error generating Stream token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
