const mongoose = require('mongoose');
const validator = require('validator');

const candidateProfileSchema = new mongoose.Schema({
    user: { // Liên kết với User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Mỗi user chỉ có một profile
    },
    fullName: {
        type: String,
        required: [true, 'Họ và tên không được để trống'],
        trim: true
    },
    dob: { // Date of Birth
        type: Date,
        required: [true, 'Ngày sinh không được để trống']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Giới tính không được để trống']
    },
    idNumber: { // Số CCCD/CMND
        type: String,
        required: [true, 'Số CCCD/CMND không được để trống'],
        unique: true, // Số CCCD phải là duy nhất
        trim: true
    },
    idIssueDate: { // Ngày cấp
        type: Date,
        required: [true, 'Ngày cấp CCCD/CMND không được để trống']
    },
    idIssuePlace: { // Nơi cấp
        type: String,
        required: [true, 'Nơi cấp CCCD/CMND không được để trống'],
        trim: true
    },
    ethnic: { // Dân tộc
        type: String,
        trim: true,
        required: [true, 'Dân tộc không được để trống']
    },
    nationality: { // Quốc tịch
        type: String,
        trim: true,
        default: 'Việt Nam',
        required: [true, 'Quốc tịch không được để trống']
    },
    permanentAddress: { // HKTT
        type: String,
        trim: true,
        required: [true, 'Địa chỉ thường trú không được để trống']
    },
    contactAddress: { // Địa chỉ liên hệ (nếu khác)
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: [true, 'Số điện thoại không được để trống'],
        // validate: [validator.isMobilePhone, 'Số điện thoại không hợp lệ', 'vi-VN'] // Tùy chỉnh validator
    },
    email: { // Email liên hệ (có thể khác email đăng nhập)
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email liên hệ không được để trống'],
        validate: [validator.isEmail, 'Email liên hệ không hợp lệ']
    },
    priorityArea: String, // Khu vực ưu tiên (KV1, KV2, KV2-NT, KV3)
    priorityObjects: [String], // Đối tượng ưu tiên (UT1, UT2,...)
    
    // Thông tin học vấn THPT
    highSchoolName: String,
    graduationYear: Number,
    gpa10: Number, // Điểm TB lớp 10
    gpa11: Number, // Điểm TB lớp 11
    gpa12: Number, // Điểm TB lớp 12
    conduct10: String, // Hạnh kiểm
    conduct11: String,
    conduct12: String,

}, { timestamps: true });

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);
module.exports = CandidateProfile;