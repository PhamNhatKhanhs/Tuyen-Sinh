const CandidateProfile = require('../models/CandidateProfile');

// GET: Lấy hồ sơ cá nhân của thí sinh đang đăng nhập
exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await CandidateProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ cá nhân. Bạn có thể cần tạo mới.' });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

// POST/PUT: Tạo hoặc cập nhật hồ sơ cá nhân
exports.upsertMyProfile = async (req, res, next) => {
    try {
        const profileData = { ...req.body, user: req.user.id };
        // Loại bỏ các trường không được phép cập nhật trực tiếp hoặc không có trong schema
        // delete profileData.user; // user đã được gán từ req.user.id

        const profile = await CandidateProfile.findOneAndUpdate(
            { user: req.user.id },
            profileData,
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ success: true, message: 'Hồ sơ đã được cập nhật.', data: profile });
    } catch (error) {
        next(error);
    }
};