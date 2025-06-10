const University = require('../models/University');

// Admin: Tạo trường mới
exports.createUniversity = async (req, res, next) => {
    try {
        const { name, code, address, website, logoUrl, description } = req.body;
        const newUniversity = await University.create({
            name,
            code,
            address,
            website,
            logoUrl,
            description,
            createdBy: req.user.id // Lấy từ authMiddleware
        });
        res.status(201).json({
            success: true,
            data: newUniversity
        });
    } catch (error) {
        next(error);
    }
};

// Public & Admin: Lấy danh sách các trường (có phân trang, tìm kiếm)
exports.getAllUniversities = async (req, res, next) => {
    try {
        // TODO: Implement pagination, searching, sorting
        const query = req.user?.role === 'admin' ? {} : { isActive: true }; // Admin thấy cả trường inactive
        
        let universitiesQuery = University.find(query);

        // Search
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // 'i' for case-insensitive
            universitiesQuery = universitiesQuery.find({
                $or: [{ name: searchRegex }, { code: searchRegex }]
            });
        }
        
        // Sorting
        if (req.query.sortBy) {
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            universitiesQuery = universitiesQuery.sort({ [req.query.sortBy]: sortOrder });
        } else {
            universitiesQuery = universitiesQuery.sort({ name: 1 }); // Default sort by name
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await University.countDocuments(query);

        universitiesQuery = universitiesQuery.skip(startIndex).limit(limit);
        
        const universities = await universitiesQuery;

        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }
        
        res.status(200).json({
            success: true,
            count: universities.length,
            total,
            pagination,
            data: universities
        });
    } catch (error) {
        next(error);
    }
};

// Public & Admin: Lấy thông tin một trường
exports.getUniversityById = async (req, res, next) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university || (req.user?.role !== 'admin' && !university.isActive)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy trường đại học.' });
        }
        res.status(200).json({
            success: true,
            data: university
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Cập nhật thông tin trường
exports.updateUniversity = async (req, res, next) => {
    try {
        const university = await University.findByIdAndUpdate(req.params.id, 
            { ...req.body, updatedBy: req.user.id }, 
            {
                new: true, // Trả về document đã cập nhật
                runValidators: true // Chạy các validator của schema
            }
        );
        if (!university) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy trường đại học.' });
        }
        res.status(200).json({
            success: true,
            data: university
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Xóa trường (có thể là soft delete bằng cách set isActive = false)
exports.deleteUniversity = async (req, res, next) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy trường đại học.' });
        }
        // Soft delete:
        // university.isActive = false;
        // university.updatedBy = req.user.id;
        // await university.save();
        // res.status(200).json({ success: true, message: 'Đã ẩn trường đại học.'});        // Hard delete:
        await university.deleteOne(); // Hoặc University.findByIdAndDelete(req.params.id);
        res.status(200).json({ 
            success: true,
            message: 'Xóa trường đại học thành công.'
        });
    } catch (error) {
        next(error);
    }
};