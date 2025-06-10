const Application = require('../models/Application');
const University = require('../models/University');
const Major = require('../models/Major');

// Thống kê tổng quan hồ sơ
exports.getApplicationOverviewStats = async (req, res, next) => {
    try {
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        const approvedApplications = await Application.countDocuments({ status: 'approved' });
        const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
        const processingApplications = await Application.countDocuments({ status: 'processing' });
        const additionalRequiredApplications = await Application.countDocuments({ status: 'additional_required' });
        const cancelledApplications = await Application.countDocuments({ status: 'cancelled' });


        res.status(200).json({
            success: true,
            data: {
                total: totalApplications,
                pending: pendingApplications,
                approved: approvedApplications,
                rejected: rejectedApplications,
                processing: processingApplications,
                additional_required: additionalRequiredApplications,
                cancelled: cancelledApplications,
            }
        });
    } catch (error) {
        next(error);
    }
};

// Thống kê hồ sơ theo trường
exports.getApplicationsByUniversityStats = async (req, res, next) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: '$university', 
                    count: { $sum: 1 },
                    approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                }
            },
            {
                $lookup: { 
                    from: University.collection.name,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'universityInfo'
                }
            },
            { $unwind: '$universityInfo' },
            {
                $project: { 
                    _id: 0, 
                    universityId: '$_id',
                    universityName: '$universityInfo.name',
                    universityCode: '$universityInfo.code',
                    totalApplications: '$count',
                    approvedApplications: '$approved',
                    rejectedApplications: '$rejected',
                    pendingApplications: '$pending',
                }
            },
            { $sort: { totalApplications: -1 } } 
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

// THỐNG KÊ HỒ SƠ THEO NGÀNH (MỚI)
exports.getApplicationsByMajorStats = async (req, res, next) => {
    try {
        const { universityId } = req.query; // Có thể lọc theo trường nếu muốn
        let matchStage = {};
        if (universityId) {
            // Cần convert universityId sang ObjectId nếu nó là string
            const mongoose = require('mongoose');
            if (!mongoose.Types.ObjectId.isValid(universityId)) {
                 return res.status(400).json({ success: false, message: 'University ID không hợp lệ.' });
            }
            matchStage = { university: new mongoose.Types.ObjectId(universityId) };
        }

        const stats = await Application.aggregate([
            { $match: matchStage }, // Lọc theo trường (nếu có)
            {
                $group: {
                    _id: '$major', // Group by major ID
                    count: { $sum: 1 },
                    approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    // Thêm các trường university để có thể populate sau này nếu cần
                    // hoặc để biết ngành này thuộc trường nào nếu không filter theo universityId
                    university: { $first: '$university' } 
                }
            },
            {
                $lookup: { // Join với collection majors để lấy tên ngành
                    from: Major.collection.name,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'majorInfo'
                }
            },
            { $unwind: '$majorInfo' },
            {
                $lookup: { // Join với collection universities để lấy tên trường (nếu cần)
                    from: University.collection.name,
                    localField: 'university', // Lấy từ $first ở group stage
                    foreignField: '_id',
                    as: 'universityData'
                }
            },
            {
                $project: {
                    _id: 0,
                    majorId: '$_id',
                    majorName: '$majorInfo.name',
                    majorCode: '$majorInfo.code',
                    universityName: { $arrayElemAt: ['$universityData.name', 0] }, // Lấy tên trường
                    universityCode: { $arrayElemAt: ['$universityData.code', 0] }, // Lấy mã trường
                    totalApplications: '$count',
                    approvedApplications: '$approved',
                    rejectedApplications: '$rejected',
                    pendingApplications: '$pending',
                }
            },
            { $sort: { totalApplications: -1 } }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};