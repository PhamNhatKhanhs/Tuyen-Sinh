const AdmissionMethod = require('../models/AdmissionMethod');

// ADMIN: Tạo phương thức xét tuyển mới
exports.createAdmissionMethod = async (req, res, next) => {
    try {
        const { name, code, description, isActive } = req.body;
        const newMethod = await AdmissionMethod.create({
            name,
            code,
            description,
            isActive,
            createdBy: req.user.id
        });
        res.status(201).json({
            success: true,
            data: newMethod
        });
    } catch (error) {
        next(error);
    }
};

// PUBLIC & ADMIN: Lấy tất cả phương thức xét tuyển
exports.getAllAdmissionMethods = async (req, res, next) => {
    try {
        let query = {};
        if (req.user?.role !== 'admin') {
            query.isActive = true; // Public chỉ thấy active
        }
        // Thêm filter, sort, paginate nếu cần
        const methods = await AdmissionMethod.find(query).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: methods.length,
            data: methods
        });
    } catch (error) {
        next(error);
    }
};

// PUBLIC & ADMIN: Lấy một phương thức xét tuyển bằng ID
exports.getAdmissionMethodById = async (req, res, next) => {
    try {
        const method = await AdmissionMethod.findById(req.params.id);
        if (!method || (req.user?.role !== 'admin' && !method.isActive)) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phương thức xét tuyển.' });
        }
        res.status(200).json({
            success: true,
            data: method
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Cập nhật phương thức xét tuyển
exports.updateAdmissionMethod = async (req, res, next) => {
    try {
        const method = await AdmissionMethod.findByIdAndUpdate(req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );
        if (!method) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phương thức xét tuyển.' });
        }
        res.status(200).json({
            success: true,
            data: method
        });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Xóa phương thức xét tuyển (có thể soft delete)
exports.deleteAdmissionMethod = async (req, res, next) => {
    try {
        const method = await AdmissionMethod.findById(req.params.id);
        if (!method) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phương thức xét tuyển.' });
        }
        // Soft delete:
        // method.isActive = false;
        // method.updatedBy = req.user.id;
        // await method.save();
        // return res.status(200).json({ success: true, message: 'Đã ẩn phương thức xét tuyển.' });

        await method.deleteOne();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};