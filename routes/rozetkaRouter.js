const Router = require("express");
const router = new Router();
const { rozetkaGet, rozetkaPost } = require("../utils/rozetkaAuth");

router.get("/cities", async (req, res) => {
    try {
        const { name = "" } = req.query;

        const response = await rozetkaGet(
            `/localities/search?name=${encodeURIComponent(name)}`
        );

        res.json(response.data);
    } catch (err) {
        console.error("Rozetka city error:", err.response?.data || err.message);
        res.status(500).json({ error: "Rozetka API error" });
    }
});

router.get("/warehouses", async (req, res) => {
    try {
        const { locality_id, delivery_service_id = 1, street = "" } = req.query;
        if (!locality_id)
            return res.status(400).json({ error: "locality_id is required" });

        const response = await rozetkaGet(
            `/delivery-service-pickups/search?locality_id=${locality_id}&delivery_service_id=${delivery_service_id}&status=1&expand=titleTranslate&pageSize=0&street=${encodeURIComponent(
                street
            )}`,
            { headers: { "Content-Language": "uk" } }
        );

        res.json(response.data);
    } catch (err) {
        console.error(
            "Rozetka warehouse error:",
            err.response?.data || err.message
        );
        res.status(500).json({ error: "Rozetka API error" });
    }
});

router.post("/delivery-cost", async (req, res) => {
    try {
        const { sendingDate, sender, receiver, placesItems } = req.body;
        if (!sender || !receiver || !placesItems) {
            return res
                .status(400)
                .json({ error: "sender, receiver and placesItems are required" });
        }

        const response = await rozetkaPost("/meests/calculate", {
            sendingDate,
            sender,
            receiver,
            placesItems,
        });

        res.json(response.data);
    } catch (err) {
        console.error(
            "Rozetka delivery-cost error:",
            err.response?.data || err.message
        );
        res.status(500).json({ error: "Rozetka API error" });
    }
});

module.exports = router;
