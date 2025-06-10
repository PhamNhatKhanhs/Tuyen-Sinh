const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path'); 
const config = require('./config');
const allRoutes = require('./routes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
app.use(cors({ /* ... */ }));
if (config.nodeEnv === 'development') { app.use(morgan('dev')); }
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files từ thư mục uploads (để có thể truy cập file đã upload qua URL)
// Ví dụ: http://localhost:5001/uploads/documents/filename.pdf
app.use(`/${config.uploadDir}`, express.static(path.join(__dirname, '..', config.uploadDir))); // THÊM MỚI

app.use(allRoutes);
app.all('*', (req, res, next) => { /* ... */ });
app.use(errorHandler);
module.exports = app;