const DocumentProof = require('../models/DocumentProof');
const config = require('../config');

exports.uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Không có file nào được tải lên hoặc file không hợp lệ.' });
        }

        const { documentType } = req.body; // Lấy loại minh chứng từ body
        if (!documentType) {
            // Xóa file đã tải lên nếu thiếu documentType (tùy chọn)
            // fs.unlinkSync(req.file.path); 
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp loại minh chứng (documentType).' });
        }

        const newDocument = await DocumentProof.create({
            user: req.user.id, // Lấy từ authMiddleware
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: `${config.uploadDir}/${req.file.filename}`, // Lưu đường dẫn tương đối
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            documentType: documentType 
        });

        res.status(201).json({
            success: true,
            message: 'Tải file lên thành công!',
            data: {
                documentId: newDocument._id,
                fileName: newDocument.fileName,
                filePath: newDocument.filePath, // Trả về đường dẫn để FE có thể hiển thị hoặc dùng sau
                originalName: newDocument.originalName,
                documentType: newDocument.documentType,
            }
        });
    } catch (error) {
        // Nếu có lỗi khi lưu vào DB, cân nhắc xóa file đã tải lên
        if (req.file && req.file.path) {
            // fs.unlinkSync(req.file.path); // Cẩn thận khi dùng trong production
        }
        next(error);
    }
};