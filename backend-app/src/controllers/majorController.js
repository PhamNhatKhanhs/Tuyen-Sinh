const Major = require('../models/Major');
const University = require('../models/University'); // Để kiểm tra trường tồn tại

// Admin: Tạo ngành mới cho một trường
exports.createMajor = async (req, res, next) => {
    try {
        const { name, code, universityId, description, admissionQuota } = req.body;

        // Kiểm tra trường đại học có tồn tại không
        const universityExists = await University.findById(universityId);
        if (!universityExists) {
            return res.status(404).json({ success: false, message: `Không tìm thấy trường đại học với ID: ${universityId}` });
        }

        const newMajor = await Major.create({
            name,
            code,
            university: universityId,
            description,
            admissionQuota,
            createdBy: req.user.id
        });
        res.status(201).json({
            success: true,
            data: newMajor
        });
    } catch (error) {
        next(error);
    }
};

// Public & Admin: Lấy danh sách các ngành (có thể filter theo trường)
exports.getAllMajors = async (req, res, next) => {
    try {
        const { universityId, search, page = 1, limit = 10, sortBy, sortOrder } = req.query;
        let query = {};

        if (req.user?.role !== 'admin') {
            query.isActive = true; // Chỉ hiển thị ngành active cho public
        }

        if (universityId) {
            query.university = universityId;
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { code: searchRegex }];
        }

        let majorsQuery = Major.find(query).populate('university', 'name code'); // Populate tên trường

        // Sorting
        if (sortBy) {
            majorsQuery = majorsQuery.sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
        } else {
            majorsQuery = majorsQuery.sort({ name: 1 });
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        majorsQuery = majorsQuery.skip(skip).limit(parseInt(limit));
        
        const majors = await majorsQuery;
        const total = await Major.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: majors.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            data: majors
        });
    } catch (error) {
        next(error);
    }
};

// Public & Admin: Lấy thông tin một ngành
exports.getMajorById = async (req, res, next) => {
    try {
        const major = await Major.findById(req.params.id).populate('university', 'name code');
        if (!major || (req.user?.role !== 'admin' && !major.isActive)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy ngành học.' });
        }
        res.status(200).json({
            success: true,
            data: major
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Cập nhật thông tin ngành
exports.updateMajor = async (req, res, next) => {
    try {
        // Không cho phép thay đổi universityId của ngành qua API này, nếu cần phải xóa tạo lại hoặc có API riêng
        const { universityId, ...updateData } = req.body; 
        if (universityId && universityId !== req.params.universityId) { // Giả sử có param universityId từ route cha
            // Hoặc nếu không có route cha, thì không cho phép thay đổi trường của ngành
        }

        const major = await Major.findByIdAndUpdate(req.params.id, 
            { ...updateData, updatedBy: req.user.id },
            { new: true, runValidators: true }
        ).populate('university', 'name code');

        if (!major) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy ngành học.' });
        }
        res.status(200).json({
            success: true,
            data: major
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Xóa ngành
exports.deleteMajor = async (req, res, next) => {
    try {
        const major = await Major.findById(req.params.id);
        if (!major) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy ngành học.' });
        }
        // TODO: Kiểm tra xem ngành có đang được sử dụng trong hồ sơ không trước khi xóa cứng
        // Hoặc soft delete:
        // major.isActive = false;
        // major.updatedBy = req.user.id;
        // await major.save();
        // return res.status(200).json({ success: true, message: 'Đã ẩn ngành học.'});

        await major.deleteOne();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};