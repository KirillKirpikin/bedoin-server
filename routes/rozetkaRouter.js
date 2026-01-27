const Router = require("express");
const router = new Router();
const axios = require("axios");

const ROZETKA_TOKEN = process.env.ROZETKA_TOKEN;

const rozHttp = axios.create({
    baseURL: "https://api-seller.rozetka.com.ua",
    headers: {
        Authorization: `Bearer ${ROZETKA_TOKEN}`,
        "Content-Type": "application/json",
    },
});

router.get("/cities", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ error: "name is required" });

        const response = await rozHttp.get(
            `/localities/search?name=${encodeURIComponent(name)}`
        );
        if (!response.data.success) return res.status(502).json(response.data);

        res.json(response.data);
    } catch (err) {
        console.error("Rozetka city error:", err.response?.data || err.message);
        res.status(500).json({ error: "Rozetka API error" });
    }
});

router.get("/warehouses", async (req, res) => {
    try {
        const { locality_id, delivery_service_id = 1 } = req.query;
        if (!locality_id)
            return res.status(400).json({ error: "locality_id is required" });

        const response = await rozHttp.get(
            `/delivery-service-pickups/search?locality_id=${locality_id}&delivery_service_id=${delivery_service_id}`,
            { headers: { "Content-Language": "uk" } }
        );

        if (!response.data.success) return res.status(502).json(response.data);

        res.json(response.data);
    } catch (err) {
        console.error(
            "Rozetka warehouse error:",
            err.response?.data || err.message
        );
        res.status(500).json({ error: "Rozetka API error" });
    }
});
module.exports = router;
