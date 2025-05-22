const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri, {
            // useNewUrlParser: true, // Không còn cần thiết từ Mongoose 6+
            // useUnifiedTopology: true, // Không còn cần thiết từ Mongoose 6+
            // useCreateIndex: true, // Không còn hỗ trợ, dùng createIndexes trực tiếp trên model nếu cần
            // useFindAndModify: false, // Không còn hỗ trợ
        });
        console.log('MongoDB Connected successfully...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Thoát tiến trình nếu không kết nối được DB
        process.exit(1);
    }
};

module.exports = connectDB;