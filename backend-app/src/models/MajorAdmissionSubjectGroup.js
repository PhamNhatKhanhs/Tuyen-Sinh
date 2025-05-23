const mongoose = require('mongoose');

const majorAdmissionSubjectGroupSchema = new mongoose.Schema({
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
    subjectGroup: { // Tổ hợp môn được chấp nhận cho ngành và phương thức này
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectGroup',
        // SỬA Ở ĐÂY: Bỏ required: true hoặc đặt là false nếu trường này có thể không có
        // required: true, // Dòng này sẽ được bỏ hoặc sửa
    },
    year: { 
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    minScoreRequired: Number, 
    isActive: { 
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

// Đảm bảo sự kết hợp là duy nhất cho một năm cụ thể NẾU subjectGroup tồn tại
// Nếu subjectGroup có thể null, index này cần được điều chỉnh hoặc tạo partial index
// Hiện tại, nếu subjectGroup là null, nhiều record có thể có major, admissionMethod, year giống nhau
// Để đơn giản, chúng ta có thể giữ index như cũ, MongoDB sẽ bỏ qua các document có subjectGroup là null khỏi unique constraint này.
// Hoặc, nếu muốn đảm bảo (major, admissionMethod, year) là unique khi subjectGroup là null:
// majorAdmissionSubjectGroupSchema.index({ major: 1, admissionMethod: 1, year: 1, subjectGroup: 1}, { unique: true, partialFilterExpression: { subjectGroup: { $exists: true } } });
// majorAdmissionSubjectGroupSchema.index({ major: 1, admissionMethod: 1, year: 1}, { unique: true, partialFilterExpression: { subjectGroup: { $exists: false } } });
// Cách đơn giản nhất là giữ index cũ, nó sẽ áp dụng unique cho các document có subjectGroup.
majorAdmissionSubjectGroupSchema.index({ major: 1, admissionMethod: 1, subjectGroup: 1, year: 1 }, { unique: true });


const MajorAdmissionSubjectGroup = mongoose.model('MajorAdmissionSubjectGroup', majorAdmissionSubjectGroupSchema);
module.exports = MajorAdmissionSubjectGroup;