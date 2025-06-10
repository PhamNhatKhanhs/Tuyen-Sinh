const mongoose = require('mongoose');

const documentProofSchema = new mongoose.Schema({
    user: { // User đã upload file này (thí sinh)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // application: { // Sẽ được liên kết sau khi hồ sơ được tạo
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Application',
    // },
    originalName: { // Tên file gốc từ client
        type: String,
        required: true,
        trim: true
    },
    fileName: { // Tên file được lưu trên server (có thể là tên ngẫu nhiên để tránh trùng lặp)
        type: String,
        required: true,
        trim: true
    },
    filePath: { // Đường dẫn tương đối đến file trên server
        type: String,
        required: true,
        trim: true
    },
    fileType: { // MIME type (image/jpeg, application/pdf)
        type: String,
        required: true,
        trim: true
    },
    fileSize: { // Kích thước file (bytes)
        type: Number,
        required: true
    },
    documentType: { // Loại minh chứng: 'hoc_ba', 'cccd', 'giay_tot_nghiep_tam_thoi', 'giay_uu_tien', 'khac'
        type: String,
        required: true,
        trim: true
    },
    // Thêm trường isVerified bởi admin nếu cần
}, { timestamps: true });

const DocumentProof = mongoose.model('DocumentProof', documentProofSchema);
module.exports = DocumentProof;