// Model này liên kết Ngành, Phương thức và Tổ hợp môn được chấp nhận
// Một ngành, theo một phương thức cụ thể, có thể chấp nhận nhiều tổ hợp môn.
const mongoose = require('mongoose');

const majorAdmissionSubjectGroupSchema = new mongoose.Schema({
    major: { // Ngành học
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true,
    },
    admissionMethod: { // Phương thức xét tuyển
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdmissionMethod',
        required: true,
    },
    subjectGroup: { // Tổ hợp môn được chấp nhận cho ngành và phương thức này
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectGroup',
        required: true,
    },
    // Có thể thêm các thông tin cụ thể cho liên kết này nếu cần, ví dụ:
    // minScoreRequired: Number, // Điểm sàn riêng cho tổ hợp này với ngành này
    // admissionPeriod: String, // Đợt tuyển sinh (ví dụ: "Đợt 1 - 2025")
    year: { // Năm tuyển sinh mà liên kết này áp dụng
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    isActive: { // Admin có thể kích hoạt/vô hiệu hóa liên kết này
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Đảm bảo sự kết hợp là duy nhất cho một năm cụ thể
majorAdmissionSubjectGroupSchema.index({ major: 1, admissionMethod: 1, subjectGroup: 1, year: 1 }, { unique: true });

const MajorAdmissionSubjectGroup = mongoose.model('MajorAdmissionSubjectGroup', majorAdmissionSubjectGroupSchema);
module.exports = MajorAdmissionSubjectGroup;