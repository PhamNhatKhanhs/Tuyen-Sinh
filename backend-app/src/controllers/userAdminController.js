const User = require('../models/User');

// ADMIN: Lấy danh sách người dùng (có filter, pagination)
exports.getAllUsersAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        let filter = {};
        if (role) filter.role = role;
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const users = await User.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).select('-password');
        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pagination: { page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Cập nhật trạng thái isActive của User
exports.updateUserStatusAdmin = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Trường isActive phải là true hoặc false.' });
        }
        const user = await User.findByIdAndUpdate(req.params.userId, { isActive }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }
        res.status(200).json({ success: true, message: `Trạng thái người dùng đã được cập nhật.`, data: user });
    } catch (error) {
        next(error);
    }
};