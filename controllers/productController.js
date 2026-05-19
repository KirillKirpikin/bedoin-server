const Coffee = require("../models/coffee-model");
const Drip = require("../models/drip-model");
const Lemonade = require("../models/lemonade-model");
const Merch = require("../models/merch-model");

const MODELS = { Coffee, Drip, Lemonade, Merch };

class ProductController {
    async getByRefs(req, res) {
        try {
            const refs = Array.isArray(req.body.refs) ? req.body.refs : [];
            const grouped = refs.reduce((acc, r) => {
                if (!r?.model || !r?.item) return acc;
                if (!acc[r.model]) acc[r.model] = [];
                acc[r.model].push(r.item);
                return acc;
            }, {});

            const results = [];
            for (const modelName of Object.keys(grouped)) {
                const M = MODELS[modelName];
                if (!M) continue;

                const items = await M.find({
                    _id: { $in: grouped[modelName] },
                    in_stock: true,
                })
                    .select("title imgs price in_stock short_description")
                    .lean();

                items.forEach((p) => results.push({ ...p, model: modelName }));
            }

            return res.json(results);
        } catch (e) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new ProductController();
