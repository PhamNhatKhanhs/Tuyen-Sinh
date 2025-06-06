const MajorAdmissionSubjectGroup = require('../models/MajorAdmissionSubjectGroup');
const Major = require('../models/Major');
const AdmissionMethod = require('../models/AdmissionMethod');
const SubjectGroup = require('../models/SubjectGroup');
const mongoose = require('mongoose');

// ADMIN: Tạo liên kết Ngành - Phương thức - Tổ hợp
exports.linkMajorMethodGroup = async (req, res, next) => {
    try {
        const { majorId, admissionMethodId, subjectGroupId, year, minScoreRequired, isActive } = req.body;

        // Validate IDs exist (optional but good practice)
        const [majorExists, methodExists, groupExists] = await Promise.all([
            Major.findById(majorId),
            AdmissionMethod.findById(admissionMethodId),
            SubjectGroup.findById(subjectGroupId)
        ]);
        if (!majorExists || !methodExists || !groupExists) {
            return res.status(400).json({ success: false, message: 'Một hoặc nhiều ID (Ngành, Phương thức, Tổ hợp) không hợp lệ.' });
        }

        const newLink = await MajorAdmissionSubjectGroup.create({
            major: majorId,
            admissionMethod: admissionMethodId,
            subjectGroup: subjectGroupId,
            year: year || new Date().getFullYear(),
            minScoreRequired,
            isActive,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: newLink });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, message: 'Liên kết này (Ngành, Phương thức, Tổ hợp, Năm) đã tồn tại.' });
        }
        next(error);
    }
};

// PUBLIC & ADMIN: Lấy danh sách liên kết (dùng để FE lấy tổ hợp cho ngành/phương thức)
exports.getLinks = async (req, res, next) => {
    try {
        const { majorId, admissionMethodId, universityId, year, subjectGroupId } = req.query;
        let filter = {};

        if (req.user?.role !== 'admin') {
            filter.isActive = true;
        }

        if (majorId) {
            if (!mongoose.Types.ObjectId.isValid(majorId)) {
                return res.status(400).json({ success: false, message: 'majorId không hợp lệ.' });
            }
            filter.major = new mongoose.Types.ObjectId(majorId);
        }
        if (admissionMethodId) {
            if (!mongoose.Types.ObjectId.isValid(admissionMethodId)) {
                return res.status(400).json({ success: false, message: 'admissionMethodId không hợp lệ.' });
            }
            filter.admissionMethod = new mongoose.Types.ObjectId(admissionMethodId);
        }
        if (subjectGroupId) {
            if (!mongoose.Types.ObjectId.isValid(subjectGroupId)) {
                return res.status(400).json({ success: false, message: 'subjectGroupId không hợp lệ.' });
            }
            filter.subjectGroup = new mongoose.Types.ObjectId(subjectGroupId);
        }
        if (year) filter.year = year;
        
        console.log('FILTER:', filter);
        let query = MajorAdmissionSubjectGroup.find(filter)
            .populate({
                path: 'major',
                select: 'name code university',
                populate: { path: 'university', select: 'name code' } // Populate trường của ngành
            })
            .populate('admissionMethod', 'name code')
            .populate('subjectGroup', 'code name subjects');

        // Nếu có universityId, cần filter sâu hơn vì major mới có universityId
        if (universityId && !majorId) { // Chỉ filter theo university nếu majorId chưa được cung cấp
            if (!mongoose.Types.ObjectId.isValid(universityId)) {
                return res.status(400).json({ success: false, message: 'universityId không hợp lệ.' });
            }
            const majorsInUniversity = await Major.find({ university: new mongoose.Types.ObjectId(universityId) }).select('_id');
            const majorIds = majorsInUniversity.map(m => m._id);
            query = query.where('major').in(majorIds);
        }
        
        const links = await query;
        console.log('RESULT:', links.length, links.map(l => l._id));
        res.status(200).json({ success: true, count: links.length, data: links });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Lấy một liên kết bằng ID
exports.getLinkById = async (req, res, next) => {
    try {
        const link = await MajorAdmissionSubjectGroup.findById(req.params.id)
            .populate('major', 'name code')
            .populate('admissionMethod', 'name code')
            .populate('subjectGroup', 'code name subjects');
        if (!link) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy liên kết.' });
        }
        res.status(200).json({ success: true, data: link });
    } catch (error) {
        next(error);
    }
};


// ADMIN: Cập nhật một liên kết
exports.updateLink = async (req, res, next) => {
    try {
        // Không cho phép thay đổi major, admissionMethod, subjectGroup, year của link qua API này
        // Nếu cần thay đổi, nên xóa link cũ và tạo link mới
        const { majorId, admissionMethodId, subjectGroupId, year, ...updateData } = req.body;

        const link = await MajorAdmissionSubjectGroup.findByIdAndUpdate(req.params.id,
            { ...updateData, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );
        if (!link) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy liên kết.' });
        }
        res.status(200).json({ success: true, data: link });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Xóa một liên kết
exports.deleteLink = async (req, res, next) => {
    try {
        const link = await MajorAdmissionSubjectGroup.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy liên kết.' });
        }
        await link.deleteOne();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        next(error);
    }
};
