const mongoose = require('mongoose');

const admissionMethodSchema = new mongoose.Schema({
    name: { // Ví dụ: "Xét tuyển theo điểm thi THPT", "Xét học bạ", "Tuyển thẳng"
        type: String,
        required: [true, 'Tên phương thức xét tuyển không được để trống'],
        trim: true,
        unique: true // Tên phương thức nên là duy nhất trên toàn hệ thống
    },
    code: { // Mã phương thức (tùy chọn, nếu cần)
        type: String,
        trim: true,
        uppercase: true,
        unique: true,
        sparse: true // Cho phép null nhưng nếu có giá trị thì phải unique
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // Các trường này có thể không cần thiết ở model chung, mà ở liên kết với ngành
    // startDate: Date, 
    // endDate: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const AdmissionMethod = mongoose.model('AdmissionMethod', admissionMethodSchema);
module.exports = AdmissionMethod;