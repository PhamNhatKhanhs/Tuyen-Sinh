const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên ngành không được để trống'],
        trim: true,
    },
    code: { // Mã ngành (duy nhất trong một trường)
        type: String,
        required: [true, 'Mã ngành không được để trống'],
        trim: true,
        uppercase: true,
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: [true, 'Ngành phải thuộc về một trường đại học'],
    },
    description: {
        type: String,
        trim: true,
    },
    admissionQuota: { // Chỉ tiêu tuyển sinh
        type: Number,
        default: 0,
        min: [0, 'Chỉ tiêu không thể âm']
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

// Đảm bảo mã ngành là duy nhất trong phạm vi một trường
majorSchema.index({ university: 1, code: 1 }, { unique: true });
// Đảm bảo tên ngành là duy nhất trong phạm vi một trường (tùy chọn)
majorSchema.index({ university: 1, name: 1 }, { unique: true });


const Major = mongoose.model('Major', majorSchema);
module.exports = Major;