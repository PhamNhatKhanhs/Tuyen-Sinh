const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidate: { // Thí sinh nộp hồ sơ (User ID)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    candidateProfileSnapshot: { // Snapshot thông tin cá nhân và học vấn tại thời điểm nộp
        // Bạn có thể nhúng trực tiếp các trường từ CandidateProfile vào đây
        // Hoặc chỉ lưu ID của CandidateProfile và join khi cần (nhưng snapshot an toàn hơn)
        type: Object, // Sẽ chứa các trường như fullName, dob, idNumber, gpa12, etc.
        required: true,
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true,
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true,
    },
    admissionMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdmissionMethod',
        required: true,
    },
    subjectGroup: { // Có thể null nếu phương thức không yêu cầu tổ hợp
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectGroup',
    },
    year: { // Năm tuyển sinh
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'additional_required', 'approved', 'rejected', 'cancelled'],
        default: 'pending', // Chờ duyệt, Đang xử lý, Yêu cầu bổ sung, Đã duyệt, Từ chối, Đã hủy
    },
    examScores: { // Điểm các môn theo tổ hợp đã chọn (nếu có)
        type: Map, // Ví dụ: { "Toán": 8.5, "Lý": 7.0 }
        of: Number,
    },
    totalScore: Number, // Tổng điểm xét tuyển (có thể được tính toán)
    priorityScore: { type: Number, default: 0 }, // Điểm ưu tiên
    finalScore: Number, // Điểm xét tuyển cuối cùng

    documents: [{ // Danh sách các ID của DocumentProof
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DocumentProof'
    }],
    adminNotes: String, // Ghi chú của admin khi duyệt
    lastProcessedBy: { // Admin xử lý lần cuối
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date, // Thời điểm xử lý lần cuối
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// style: Enhanced Application functionality


// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// fix: Enhanced Application functionality

