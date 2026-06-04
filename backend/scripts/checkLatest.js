const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const notifs = await db.collection("notifications").find({}).sort({ _id: -1 }).limit(5).toArray();
    for (const n of notifs) {
        console.log(`[${n._id}] message type=${typeof n.message} value="${n.message}" hasObj=${/\[object Object\]/.test(n.message)}`);
    }
    await mongoose.disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });