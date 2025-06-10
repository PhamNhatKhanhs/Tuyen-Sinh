const mongoose = require('mongoose');

const subjectGroupSchema = new mongoose.Schema({
    code: { // Ví dụ: A00, A01, B00, D01
        type: String,
        required: [true, 'Mã tổ hợp môn không được để trống'],
        trim: true,
        uppercase: true,
        unique: true,
    },
    name: { // Ví dụ: "Toán, Vật lý, Hóa học"
        type: String,
        required: [true, 'Tên tổ hợp môn không được để trống'],
        trim: true,
    },
    subjects: { // Danh sách các môn học trong tổ hợp
        type: [String],
        required: [true, 'Cần có ít nhất một môn trong tổ hợp'],
        validate: [value => value.length > 0, 'Danh sách môn không được rỗng']
    },
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

const SubjectGroup = mongoose.model('SubjectGroup', subjectGroupSchema);
module.exports = SubjectGroup;