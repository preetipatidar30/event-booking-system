const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                retryWrites: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            isConnected = true;
            return;
        } catch (error) {
            console.error(`MongoDB Connection Attempt ${i + 1} Failed: ${error.message}`);
            if (i < retries - 1) {
                console.log(`Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.log('⚠️ Server running without database - using dummy data mode');
    isConnected = false;
};

const isDBConnected = () => isConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
