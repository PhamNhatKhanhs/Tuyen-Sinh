const SubjectGroup = require('../models/SubjectGroup');

// ADMIN: Tạo tổ hợp môn mới
exports.createSubjectGroup = async (req, res, next) => {
    try {
        const { code, name, subjects, isActive } = req.body;
        const newGroup = await SubjectGroup.create({
            code,
            name,
            subjects,
            isActive,
            createdBy: req.user.id
        });
        res.status(201).json({
            success: true,
            data: newGroup
        });
    } catch (error) {
        next(error);
    }
};

// PUBLIC & ADMIN: Lấy tất cả tổ hợp môn
exports.getAllSubjectGroups = async (req, res, next) => {
    try {
        let query = {};
        if (req.user?.role !== 'admin') {
            query.isActive = true;
        }
        const groups = await SubjectGroup.find(query).sort({ code: 1 });
        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    } catch (error) {
        next(error);
    }
};

// PUBLIC & ADMIN: Lấy một tổ hợp môn bằng ID
exports.getSubjectGroupById = async (req, res, next) => {
    try {
        const group = await SubjectGroup.findById(req.params.id);
        if (!group || (req.user?.role !== 'admin' && !group.isActive)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tổ hợp môn.' });
        }
        res.status(200).json({
            success: true,
            data: group
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Cập nhật tổ hợp môn
exports.updateSubjectGroup = async (req, res, next) => {
    try {
        const group = await SubjectGroup.findByIdAndUpdate(req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );
        if (!group) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tổ hợp môn.' });
        }
        res.status(200).json({
            success: true,
            data: group
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Xóa tổ hợp môn
exports.deleteSubjectGroup = async (req, res, next) => {
    try {
        const group = await SubjectGroup.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tổ hợp môn.' });
        }
        await group.deleteOne();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};