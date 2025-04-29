export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type, Origin');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { account, signedBy } = req.body;
    const sharedSecret = process.env.SHARED_SECRET;
    const privateKey = process.env.PRIVATE_KEY;

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    if (token !== sharedSecret) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!account || !signedBy) {
        return res.status(400).json({ error: "Missing 'account' or 'signedBy' field" });
    }

    const isAllowed = true;
    const isSponsored = false;

    if (!isAllowed) {
        return res.json({ allowed: false, reason: "User not allowed to login" });
    }

    res.json({
        allowed: true,
        sponsored: isSponsored,
        signingKey: privateKey,
    });
}
