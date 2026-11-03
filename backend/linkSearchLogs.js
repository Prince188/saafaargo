const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const SearchLog = require('./models/SearchLog');
        const Visitor = require('./models/Visitor');
        const User = require('./models/User');

        const unlinked = await SearchLog.find({ userId: null }).lean();
        console.log('Unlinked searches count:', unlinked.length);

        let updatedCount = 0;
        for (const log of unlinked) {
            if (!log.ip) continue;
            const visitor = await Visitor.findOne({
                ip: log.ip,
                userId: { $exists: true, $ne: 'guest' }
            }).sort({ updatedAt: -1 });

            if (visitor && visitor.userId && mongoose.Types.ObjectId.isValid(visitor.userId)) {
                const user = await User.findById(visitor.userId);
                if (user) {
                    await SearchLog.updateOne({ _id: log._id }, { $set: { userId: user._id } });
                    console.log(`Linked SearchLog (${log.routeKey} at ${log.createdAt}) to User: ${user.firstName} ${user.lastName} (${user.email})`);
                    updatedCount++;
                }
            }
        }
        console.log('Total SearchLogs linked:', updatedCount);
        process.exit(0);
    } catch (err) {
        console.error('Error linking search logs:', err);
        process.exit(1);
    }
})();
