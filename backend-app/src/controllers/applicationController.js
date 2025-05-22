const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const University = require('../models/University');
const Major = require('../models/Major');
const AdmissionMethod = require('../models/AdmissionMethod');
const SubjectGroup = require('../models/SubjectGroup');
const DocumentProof = require('../models/DocumentProof');
const MajorAdmissionSubjectGroup = require('../models/MajorAdmissionSubjectGroup');
const sendEmail = require('../services/emailService');
const createNotification = require('../utils/createNotification');

// Thí sinh: Nộp hồ sơ mới
exports.submitApplication = async (req, res, next) => {
    try {
        const candidateId = req.user.id; 
        const candidateEmail = req.user.email; 
        const {
            personalInfo, 
            academicInfo, 
            applicationChoice, 
            examScores, 
            documentIds 
        } = req.body;

        const profileDetails = { ...personalInfo, ...academicInfo, user: candidateId, email: personalInfo.email || candidateEmail };
        const candidateProfile = await CandidateProfile.findOneAndUpdate(
            { user: candidateId },
            profileDetails,
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        const university = await University.findById(applicationChoice.universityId);
        if (!university || !university.isActive) return res.status(400).json({ success: false, message: 'Trường đại học không hợp lệ hoặc không hoạt động.' });
        
        const major = await Major.findOne({ _id: applicationChoice.majorId, university: applicationChoice.universityId });
        if (!major || !major.isActive) return res.status(400).json({ success: false, message: 'Ngành học không hợp lệ hoặc không hoạt động cho trường đã chọn.' });
        
        const admissionMethod = await AdmissionMethod.findById(applicationChoice.admissionMethodId);
        if (!admissionMethod || !admissionMethod.isActive) return res.status(400).json({ success: false, message: 'Phương thức xét tuyển không hợp lệ hoặc không hoạt động.' });

        let subjectGroup = null;
        if (applicationChoice.subjectGroupId) {
            subjectGroup = await SubjectGroup.findById(applicationChoice.subjectGroupId);
            if (!subjectGroup || !subjectGroup.isActive) return res.status(400).json({ success: false, message: 'Tổ hợp môn không hợp lệ hoặc không hoạt động.' });
            
            const currentYear = applicationChoice.year || new Date().getFullYear();
            const isValidLink = await MajorAdmissionSubjectGroup.findOne({
                major: applicationChoice.majorId,
                admissionMethod: applicationChoice.admissionMethodId,
                subjectGroup: applicationChoice.subjectGroupId,
                year: currentYear,
                isActive: true
            });
            if (!isValidLink) {
                return res.status(400).json({ success: false, message: `Tổ hợp môn '${subjectGroup.code}' không hợp lệ cho ngành '${major.name}' và phương thức '${admissionMethod.name}' trong năm ${currentYear}.` });
            }
        }
        
        if (documentIds && documentIds.length > 0) {
             const docs = await DocumentProof.find({ _id: { $in: documentIds }, user: candidateId });
            if (docs.length !== documentIds.length) {
                return res.status(400).json({ success: false, message: 'Một hoặc nhiều minh chứng không hợp lệ hoặc không thuộc về bạn.' });
            }
        }

        const applicationSnapshot = {
            fullName: candidateProfile.fullName,
            dob: candidateProfile.dob,
            gender: candidateProfile.gender,
            idNumber: candidateProfile.idNumber,
            phoneNumber: candidateProfile.phoneNumber,
            email: candidateProfile.email,
            permanentAddress: candidateProfile.permanentAddress,
            priorityArea: candidateProfile.priorityArea,
            priorityObjects: candidateProfile.priorityObjects,
            highSchoolName: candidateProfile.highSchoolName,
            graduationYear: candidateProfile.graduationYear,
            gpa10: candidateProfile.gpa10,
            gpa11: candidateProfile.gpa11,
            gpa12: candidateProfile.gpa12,
            conduct10: candidateProfile.conduct10,
            conduct11: candidateProfile.conduct11,
            conduct12: candidateProfile.conduct12,
        };

        const newApplicationData = {
            candidate: candidateId,
            candidateProfileSnapshot: applicationSnapshot,
            university: applicationChoice.universityId,
            major: applicationChoice.majorId,
            admissionMethod: applicationChoice.admissionMethodId,
            subjectGroup: applicationChoice.subjectGroupId, 
            year: applicationChoice.year || new Date().getFullYear(),
            examScores: examScores || {},
            documents: documentIds || [],
            status: 'pending',
        };
        
        if (!applicationChoice.subjectGroupId) {
            delete newApplicationData.subjectGroup;
        }

        const newApplication = await Application.create(newApplicationData);
        
        const emailSubject = `Xác nhận nộp hồ sơ thành công - Mã HS: ${newApplication._id}`;
        const emailHtml = `<p>Chào ${candidateProfile.fullName || 'bạn'},</p>
                           <p>Hồ sơ xét tuyển của bạn với mã số <strong>${newApplication._id}</strong> vào ngành ${major.name} - ${university.name} đã được nộp thành công.</p>
                           <p>Chúng tôi sẽ sớm xem xét hồ sơ của bạn. Bạn có thể theo dõi trạng thái hồ sơ tại trang cá nhân.</p>
                           <p>Trân trọng,</p>
                           <p>Hệ thống Tuyển sinh Đại học</p>`;
        await sendEmail(candidateEmail, emailSubject, '', emailHtml);
        await createNotification(
            candidateId,
            'Nộp hồ sơ thành công!',
            `Hồ sơ ${newApplication._id} đã được nộp. Chúng tôi sẽ thông báo khi có cập nhật.`,
            'application_submitted',
            `/candidate/applications/${newApplication._id}`, 
            newApplication._id
        );

        res.status(201).json({
            success: true,
            message: 'Nộp hồ sơ thành công!',
            data: newApplication
        });

    } catch (error) {
        next(error);
    }
};

// Thí sinh: Lấy danh sách hồ sơ đã nộp
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user.id })
            .populate('university', 'name code')
            .populate('major', 'name code')
            .populate('admissionMethod', 'name')
            .populate('subjectGroup', 'code name')
            .sort({ submissionDate: -1 });
            
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Thí sinh: Lấy chi tiết một hồ sơ
exports.getMyApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findOne({ _id: req.params.id, candidate: req.user.id })
            .populate('university', 'name code logoUrl website address')
            .populate('major', 'name code description')
            .populate('admissionMethod', 'name description')
            .populate('subjectGroup', 'code name subjects')
            .populate('documents'); 

        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ.' });
        }
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// === ADMIN CONTROLLERS FOR APPLICATIONS ===

// ADMIN: Lấy tất cả hồ sơ (với filter, pagination)
exports.getAllApplicationsAdmin = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'submissionDate', 
            sortOrder = 'desc',
            status,
            universityId,
            majorId,
            admissionMethodId,
            year,
            searchCandidate 
        } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (universityId) filter.university = universityId;
        if (majorId) filter.major = majorId;
        if (admissionMethodId) filter.admissionMethod = admissionMethodId;
        if (year) filter.year = year;

        if (searchCandidate) {
            const users = await User.find({ 
                $or: [
                    { fullName: { $regex: searchCandidate, $options: 'i' } },
                    { email: { $regex: searchCandidate, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = users.map(u => u._id);
            if (userIds.length > 0) {
                filter.candidate = { $in: userIds };
            } else {
                return res.status(200).json({ success: true, count: 0, total: 0, data: [], pagination: {} });
            }
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const applications = await Application.find(filter)
            .populate('candidate', 'fullName email') 
            .populate('university', 'name code')
            .populate('major', 'name code')
            .populate('admissionMethod', 'name')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Application.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: applications.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            data: applications
        });

    } catch (error) {
        next(error);
    }
};

// ADMIN: Lấy chi tiết một hồ sơ
exports.getApplicationByIdAdmin = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('candidate', 'fullName email')
            .populate('university', 'name code logoUrl website address')
            .populate('major', 'name code description')
            .populate('admissionMethod', 'name description')
            .populate('subjectGroup', 'code name subjects')
            .populate('documents'); 

        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng tuyển.' });
        }
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

// ADMIN: Cập nhật trạng thái hồ sơ
exports.updateApplicationStatusAdmin = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp trạng thái mới.' });
        }
        const allowedStatus = ['pending', 'processing', 'additional_required', 'approved', 'rejected', 'cancelled'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        }

        const application = await Application.findById(req.params.id).populate('candidate'); // Populate candidate để lấy thông tin
        if (!application) { 
             return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng tuyển.' });
        }

        const oldStatus = application.status;
        application.status = status;
        if (adminNotes) application.adminNotes = adminNotes;
        application.lastProcessedBy = req.user.id; 
        application.processedAt = Date.now();
        await application.save();
        
        // SỬA LỖI Ở ĐÂY: Bỏ ép kiểu `as any`
        if (application.candidate && application.candidate.email && oldStatus !== status) { 
            const candidateUser = application.candidate; // candidateUser giờ là object User đã populate
            const emailSubject = `Cập nhật trạng thái hồ sơ - Mã HS: ${application._id}`;
            const emailHtml = `<p>Chào ${candidateUser.fullName || 'bạn'},</p>
                               <p>Hồ sơ xét tuyển của bạn với mã số <strong>${application._id}</strong> đã được cập nhật trạng thái thành: <strong>${status.toUpperCase()}</strong>.</p>
                               ${adminNotes ? `<p>Ghi chú từ ban tuyển sinh: ${adminNotes}</p>` : ''}
                               <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
                               <p>Trân trọng,</p>
                               <p>Hệ thống Tuyển sinh Đại học</p>`;
            await sendEmail(candidateUser.email, emailSubject, '', emailHtml);
            await createNotification(
                candidateUser._id,
                `Hồ sơ ${application._id} cập nhật trạng thái`,
                `Trạng thái hồ sơ của bạn đã được cập nhật thành: ${status.toUpperCase()}.`,
                'status_changed',
                `/candidate/applications/${application._id}`,
                application._id
            );
        }

        res.status(200).json({
            success: true,
            message: `Trạng thái hồ sơ đã được cập nhật thành '${status}'.`,
            data: application
        });

    } catch (error) {
        next(error);
    }
};
