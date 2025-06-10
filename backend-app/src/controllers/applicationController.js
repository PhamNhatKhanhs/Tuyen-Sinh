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
const mongoose = require('mongoose');

// Thí sinh: Nộp hồ sơ mới
exports.submitApplication = async (req, res, next) => {
    console.log('SUBMIT_APP_CTRL: Request received. User:', req.user ? req.user.email : 'No user in req');
    console.log('SUBMIT_APP_CTRL: Full req.body:', JSON.stringify(req.body, null, 2));

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

        if (!personalInfo || typeof personalInfo !== 'object' || Object.keys(personalInfo).length === 0) {
            console.error('SUBMIT_APP_CTRL: Validation Error - personalInfo is missing or invalid.');
            return res.status(400).json({ success: false, message: 'Dữ liệu Thông tin cá nhân (personalInfo) không hợp lệ hoặc bị thiếu.' });
        }
        const safeAcademicInfo = academicInfo || {}; 

        if (!applicationChoice || !applicationChoice.universityId || !applicationChoice.majorId || !applicationChoice.admissionMethodId || !applicationChoice.year) {
            console.error('SUBMIT_APP_CTRL: Validation Error - applicationChoice is missing required fields.');
            return res.status(400).json({ success: false, message: 'Thông tin nguyện vọng (trường, ngành, phương thức, năm) không được để trống.' });
        }

        const profileEmail = personalInfo.email || candidateEmail;
        if (!profileEmail) {
            console.error('SUBMIT_APP_CTRL: Validation Error - Profile email (from personalInfo or user) is missing.');
            return res.status(400).json({ success: false, message: 'Email trong thông tin cá nhân hoặc email tài khoản không được để trống.' });
        }

        console.log('SUBMIT_APP_CTRL: Step 1 - Processing CandidateProfile...');
        const { idNumber } = personalInfo;

        if (!idNumber) {
            console.error('SUBMIT_APP_CTRL: Validation Error - idNumber is missing from personalInfo.');
            return res.status(400).json({ success: false, message: 'Số CMND/CCCD (idNumber) không được để trống trong thông tin cá nhân.' });
        }

        const { examScores: scoresInAcademic, ...otherAcademicInfo } = safeAcademicInfo;
        const profileDataForUpdate = {
            ...personalInfo,
            ...otherAcademicInfo,
            user: candidateId,
            email: profileEmail
        };

        // Check if a profile with this idNumber already exists
        const existingProfileWithIdNumber = await CandidateProfile.findOne({ idNumber: idNumber });

        let candidateProfile;

        if (existingProfileWithIdNumber) {
            // A profile with this idNumber exists.
            // Check if it belongs to the current user.
            if (existingProfileWithIdNumber.user.toString() !== candidateId.toString()) {
                // idNumber belongs to another user. This is a conflict.
                console.error(`SUBMIT_APP_CTRL: Conflict - idNumber ${idNumber} already registered to user ${existingProfileWithIdNumber.user}`);
                return res.status(400).json({ success: false, message: `Số CMND/CCCD '${idNumber}' đã được sử dụng bởi một tài khoản khác.` });
            } else {
                // idNumber belongs to the current user. Update their profile.
                console.log(`SUBMIT_APP_CTRL: idNumber ${idNumber} confirmed for current user ${candidateId}. Updating profile.`);
                candidateProfile = await CandidateProfile.findOneAndUpdate(
                    { _id: existingProfileWithIdNumber._id, user: candidateId }, // Ensure updating the correct user's profile
                    profileDataForUpdate,
                    { new: true, runValidators: true } // No upsert needed, we know it exists
                );
                if (!candidateProfile) {
                     console.error(`SUBMIT_APP_CTRL: Error - Failed to update existing profile for user ${candidateId} with idNumber ${idNumber}.`);
                     return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin cá nhân.' });
                }
            }
        } else {
            // No profile with this idNumber exists.
            // Create or update the current user's profile with this idNumber.
            console.log(`SUBMIT_APP_CTRL: idNumber ${idNumber} is new or user ${candidateId} is updating to it. Upserting profile for user.`);
            candidateProfile = await CandidateProfile.findOneAndUpdate(
                { user: candidateId }, // Find by user
                profileDataForUpdate,   // This will set/update their idNumber
                { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
            );
        }

        if (!candidateProfile) {
            console.error(`SUBMIT_APP_CTRL: Critical Error - CandidateProfile could not be established for user ${candidateId}.`);
            return res.status(500).json({ success: false, message: 'Không thể xử lý thông tin cá nhân thí sinh.' });
        }
        console.log('SUBMIT_APP_CTRL: CandidateProfile processed:', candidateProfile._id, 'with idNumber:', candidateProfile.idNumber);

        console.log('SUBMIT_APP_CTRL: Step 2 - Validating IDs...');
        const university = await University.findById(applicationChoice.universityId);
        if (!university || !university.isActive) { return res.status(400).json({ success: false, message: 'Trường đại học không hợp lệ hoặc không hoạt động.' });}

        const major = await Major.findOne({ _id: applicationChoice.majorId, university: applicationChoice.universityId });
        if (!major || !major.isActive) { return res.status(400).json({ success: false, message: 'Ngành học không hợp lệ hoặc không hoạt động cho trường đã chọn.' });}

        const admissionMethod = await AdmissionMethod.findById(applicationChoice.admissionMethodId);
        if (!admissionMethod || !admissionMethod.isActive) { return res.status(400).json({ success: false, message: 'Phương thức xét tuyển không hợp lệ hoặc không hoạt động.' });}

        let subjectGroupDoc = null;
        if (applicationChoice.subjectGroupId) {
            if (!mongoose.Types.ObjectId.isValid(applicationChoice.subjectGroupId)) { return res.status(400).json({ success: false, message: 'ID Tổ hợp môn không hợp lệ.' });}
            subjectGroupDoc = await SubjectGroup.findById(applicationChoice.subjectGroupId);
            if (!subjectGroupDoc || !subjectGroupDoc.isActive) { return res.status(400).json({ success: false, message: 'Tổ hợp môn không hợp lệ hoặc không hoạt động.' });}

            const currentSelectedYear = applicationChoice.year;
            const isValidLink = await MajorAdmissionSubjectGroup.findOne({
                major: applicationChoice.majorId,
                admissionMethod: applicationChoice.admissionMethodId,
                subjectGroup: applicationChoice.subjectGroupId,
                year: currentSelectedYear,
                isActive: true
            });
            if (!isValidLink) { return res.status(400).json({ success: false, message: `Tổ hợp môn '${subjectGroupDoc.code}' không hợp lệ cho ngành '${major.name}' và phương thức '${admissionMethod.name}' trong năm ${currentSelectedYear}.` });}
        }

        if (documentIds && documentIds.length > 0) {
            const validDocumentIds = documentIds.filter(id => mongoose.Types.ObjectId.isValid(id));
            if (validDocumentIds.length !== documentIds.length) { return res.status(400).json({ success: false, message: 'Một hoặc nhiều ID minh chứng không hợp lệ.' });}
            const docs = await DocumentProof.find({ _id: { $in: validDocumentIds }, user: candidateId });
            if (docs.length !== validDocumentIds.length) { return res.status(400).json({ success: false, message: 'Một hoặc nhiều minh chứng không hợp lệ hoặc không thuộc về bạn.' });}
        }
        console.log('SUBMIT_APP_CTRL: IDs validated.');

        console.log('SUBMIT_APP_CTRL: Step 3 - Creating application snapshot...');
        const applicationSnapshot = {
            fullName: candidateProfile.fullName || 'N/A', dob: candidateProfile.dob, gender: candidateProfile.gender,
            idNumber: candidateProfile.idNumber || 'N/A', phoneNumber: candidateProfile.phoneNumber, email: candidateProfile.email,
            permanentAddress: candidateProfile.permanentAddress || 'N/A', priorityArea: candidateProfile.priorityArea,
            priorityObjects: candidateProfile.priorityObjects, highSchoolName: candidateProfile.highSchoolName,
            graduationYear: candidateProfile.graduationYear, gpa10: candidateProfile.gpa10, gpa11: candidateProfile.gpa11,
            gpa12: candidateProfile.gpa12, conduct10: candidateProfile.conduct10, conduct11: candidateProfile.conduct11,
            conduct12: candidateProfile.conduct12,
        };
        console.log('SUBMIT_APP_CTRL: Application snapshot created.');

        console.log('SUBMIT_APP_CTRL: Step 4 - Creating Application document...');
        const newApplicationData = {
            candidate: candidateId, candidateProfileSnapshot: applicationSnapshot,
            university: applicationChoice.universityId, major: applicationChoice.majorId,
            admissionMethod: applicationChoice.admissionMethodId,
            subjectGroup: applicationChoice.subjectGroupId || null,
            year: applicationChoice.year,
            examScores: req.body.examScores || {},
            documents: documentIds || [], status: 'pending',
        };        const newApplicationArray = await Application.create([newApplicationData]);
        const newApplication = newApplicationArray[0];
        console.log('SUBMIT_APP_CTRL: Application document created:', newApplication._id);

        // Populate the application for response
        console.log('SUBMIT_APP_CTRL: Populating application for response...');
        const populatedApplication = await Application.findById(newApplication._id)
            .populate('candidate', 'fullName email')
            .populate('university', 'name code')
            .populate('major', 'name code')
            .populate('admissionMethod', 'name')
            .populate('subjectGroup', 'name code subjects')
            .populate('documents');
        
        if (!populatedApplication) {
            console.error('SUBMIT_APP_CTRL: Failed to populate application after creation');
            return res.status(500).json({ 
                success: false, 
                message: 'Hồ sơ đã được tạo nhưng không thể tải thông tin chi tiết.' 
            });
        }        console.log('SUBMIT_APP_CTRL: Step 5 - Sending email and creating notification...');
        const emailSubject = `Xác nhận nộp hồ sơ thành công - Mã HS: ${populatedApplication._id}`;
        const emailHtml = `<p>Chào ${candidateProfile.fullName || 'bạn'},</p><p>Hồ sơ của bạn (Mã: <strong>${populatedApplication._id}</strong>) ứng tuyển ngành ${major.name} - ${university.name} đã được nộp thành công.</p><p>Trạng thái hiện tại: Chờ duyệt. Chúng tôi sẽ thông báo khi có cập nhật.</p><p>Trân trọng,</p><p>Hệ thống Tuyển sinh Đại học</p>`;

        sendEmail(candidateEmail, emailSubject, '', emailHtml).catch(err => console.error("SUBMIT_APP_CTRL: Failed to send submission email:", err));
        createNotification( candidateId, 'Nộp hồ sơ thành công!', `Hồ sơ ${populatedApplication._id} đã được nộp.`, 'application_submitted', `/candidate/applications/${populatedApplication._id}`, populatedApplication._id).catch(err => console.error("SUBMIT_APP_CTRL: Failed to create submission notification:", err));
        console.log('SUBMIT_APP_CTRL: Email and notification tasks initiated.');        res.status(201).json({ 
            success: true, 
            message: 'Nộp hồ sơ thành công!', 
            data: populatedApplication
        });

    } catch (error) {
        console.error('SUBMIT_APP_CTRL: Error in submitApplication Controller:', error); 
        next(error); 
    }
};

exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ candidate: req.user.id }).populate('university major admissionMethod subjectGroup');
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

exports.getMyApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findOne({ _id: req.params.id, candidate: req.user.id }).populate('university major admissionMethod subjectGroup documents');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
        }
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

exports.getAllApplicationsAdmin = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchCandidate, universityId, majorId, year, dateFrom, dateTo, sortBy = 'submissionDate', sortOrder = 'desc' } = req.query;
        
        console.log('Backend getAllApplicationsAdmin - Query params:', req.query); // Debug log
        
        // Build filter object
        let filter = {};
        
        // Search by candidate name or email
        if (searchCandidate) {
            const searchRegex = new RegExp(searchCandidate, 'i');
            // First find candidates matching the search
            const User = require('../models/User');
            const matchingCandidates = await User.find({
                $or: [
                    { fullName: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');
            filter.candidate = { $in: matchingCandidates.map(u => u._id) };
        }
        
        // Filter by university
        if (universityId) {
            filter.university = universityId;
        }
        
        // Filter by major
        if (majorId) {
            filter.major = majorId;
        }
        
        // Filter by year
        if (year) {
            filter.year = parseInt(year);
        }
        
        // Filter by date range
        if (dateFrom || dateTo) {
            filter.submissionDate = {};
            if (dateFrom) {
                filter.submissionDate.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.submissionDate.$lte = new Date(dateTo);
            }
        }
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
          // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Application.countDocuments(filter);
        
        console.log('Backend - Final filter object:', filter); // Debug final filter
        console.log('Backend - Total documents found:', total); // Debug total
        
        // Get applications with filters, sorting, and pagination
        const applications = await Application.find(filter)
            .populate('candidate university major admissionMethod subjectGroup')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));
        
        res.status(200).json({ 
            success: true, 
            data: applications,
            count: applications.length,
            total: total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getApplicationByIdAdmin = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id).populate('candidate university major admissionMethod subjectGroup documents');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
        }
        res.status(200).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

exports.updateApplicationStatusAdmin = async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!application) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
        }
        res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: application });
    } catch (error) {
        next(error);
    }
};
