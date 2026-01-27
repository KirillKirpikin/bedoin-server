const cron = require("node-cron");

const OrderModel = require("../models/order-model");

function startCleanupErrorOrdersCron() {
    // Каждый день в 23:30 по Europe/Zaporozhye
    cron.schedule(
        "30 23 * * *",
        async () => {
            try {
                const cutoff = new Date();
                cutoff.setFullYear(cutoff.getFullYear() - 1);

                const result = await OrderModel.deleteMany({
                    paymentStatus: "error",
                    orderTime: { $lt: cutoff }, // <-- если у тебя createdAt, замени на createdAt
                });

                console.log(
                    `[CRON] cleanupErrorOrders: deleted=${result.deletedCount}, cutoff=${cutoff.toISOString()}`,
                );
            } catch (err) {
                console.error("[CRON] cleanupErrorOrders failed:", err);
            }
        },
        { timezone: "Europe/Zaporozhye" },
    );

    console.log("[CRON] cleanupErrorOrders scheduled: 23:30 Europe/Zaporozhye");
}

module.exports = { startCleanupErrorOrdersCron };
