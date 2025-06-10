const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

// Kết nối tới MongoDB
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`Server đang chạy ở chế độ ${config.nodeEnv} trên cổng ${PORT}...`);
});

// Xử lý các lỗi unhandled rejection (ví dụ: lỗi kết nối DB không bắt được ở connectDB)
process.on('unhandledRejection', err => {
    console.error('💥 UNHANDLED REJECTION! 💥 Đang tắt server...');
    console.error(err.name, err.message);
    server.close(() => { // Đóng server một cách từ từ
        process.exit(1); // 1 là lỗi, 0 là thành công
    });
});

// Xử lý lỗi uncaught exception (lỗi code không được try-catch)
process.on('uncaughtException', err => {
    console.error('💥 UNCAUGHT EXCEPTION! 💥 Đang tắt server...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Xử lý tín hiệu SIGTERM (ví dụ khi Heroku, Docker tắt app)
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Đang tắt server một cách từ từ...');
    server.close(() => {
        console.log('💥 Tiến trình đã bị tắt!');
    });
});