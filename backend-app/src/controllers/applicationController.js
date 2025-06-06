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

        console.log('SUBMIT_APP_CTRL: Step 1 - Upserting CandidateProfile...');
        const { examScores: scoresInAcademic, ...otherAcademicInfo } = safeAcademicInfo;
        const profileDetailsToSave = {
            ...personalInfo,
            ...otherAcademicInfo, 
            user: candidateId,
            email: profileEmail
        };

        let candidateProfile = await CandidateProfile.findOneAndUpdate(
            { user: candidateId },
            profileDetailsToSave,
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        console.log('SUBMIT_APP_CTRL: CandidateProfile upserted:', candidateProfile._id);

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
        };

        const newApplicationArray = await Application.create([newApplicationData]);
        const newApplication = newApplicationArray[0];
        console.log('SUBMIT_APP_CTRL: Application document created:', newApplication._id);

        console.log('SUBMIT_APP_CTRL: Step 5 - Sending email and creating notification...');
        const emailSubject = `Xác nhận nộp hồ sơ thành công - Mã HS: ${newApplication._id}`;
        const emailHtml = `<p>Chào ${candidateProfile.fullName || 'bạn'},</p><p>Hồ sơ của bạn (Mã: <strong>${newApplication._id}</strong>) ứng tuyển ngành ${major.name} - ${university.name} đã được nộp thành công.</p><p>Trạng thái hiện tại: Chờ duyệt. Chúng tôi sẽ thông báo khi có cập nhật.</p><p>Trân trọng,</p><p>Hệ thống Tuyển sinh Đại học</p>`;

        sendEmail(candidateEmail, emailSubject, '', emailHtml).catch(err => console.error("SUBMIT_APP_CTRL: Failed to send submission email:", err));
        createNotification( candidateId, 'Nộp hồ sơ thành công!', `Hồ sơ ${newApplication._id} đã được nộp.`, 'application_submitted', `/candidate/applications/${newApplication._id}`, newApplication._id).catch(err => console.error("SUBMIT_APP_CTRL: Failed to create submission notification:", err));
        console.log('SUBMIT_APP_CTRL: Email and notification tasks initiated.');

        res.status(201).json({ success: true, message: 'Nộp hồ sơ thành công!', data: newApplication });

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
        const applications = await Application.find().populate('candidate university major admissionMethod subjectGroup');
        res.status(200).json({ success: true, data: applications });
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
