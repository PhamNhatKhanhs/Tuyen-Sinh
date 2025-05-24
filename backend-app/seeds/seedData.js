
// backend-app/seeds/seedData.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = require('../src/config/index');

// Import Models
const User = require('../src/models/User');
const University = require('../src/models/University');
const Major = require('../src/models/Major');
const AdmissionMethod = require('../src/models/AdmissionMethod');
const SubjectGroup = require('../src/models/SubjectGroup');
const MajorAdmissionSubjectGroup = require('../src/models/MajorAdmissionSubjectGroup');
const CandidateProfile = require('../src/models/CandidateProfile');
const DocumentProof = require('../src/models/DocumentProof');
const Application = require('../src/models/Application');
const Notification = require('../src/models/Notification');

const connectDB = require('../src/config/db');

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

const seedData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for detailed seeding (re-check)...');

        console.log('Clearing existing data for all relevant collections...');
        await Notification.deleteMany({});
        await Application.deleteMany({});
        await DocumentProof.deleteMany({});
        await CandidateProfile.deleteMany({});
        await MajorAdmissionSubjectGroup.deleteMany({});
        await SubjectGroup.deleteMany({});
        await AdmissionMethod.deleteMany({});
        await Major.deleteMany({});
        await University.deleteMany({});
        await User.deleteMany({});
        console.log('All relevant data cleared.');

        // === TẠO USERS ===
        console.log('Seeding Users...');
        
        // Sử dụng create thay vì insertMany để đảm bảo middleware pre-save được gọi để hash password
        const adminUser = await User.create({
            email: 'admin@example.com', 
            password: 'adminPassword123', 
            role: 'admin', 
            fullName: 'Quản Trị Viên Chính'
        });
        
        const candidate1 = await User.create({
            email: 'candidate1@example.com', 
            password: 'candidatePassword1', 
            role: 'candidate', 
            fullName: 'Nguyễn Văn An'
        });
        
        const candidate2 = await User.create({
            email: 'candidate2@example.com', 
            password: 'candidatePassword2', 
            role: 'candidate', 
            fullName: 'Trần Thị Bình'
        });
        
        await User.create({
            email: 'candidate3@example.com', 
            password: 'candidatePassword3', 
            role: 'candidate', 
            fullName: 'Lê Minh Cường'
        });
        
        // Kiểm tra xem adminUser, candidate1, candidate2 có được tạo thành công không
        if (!adminUser || !candidate1 || !candidate2) {
            throw new Error('Failed to create seed users. Aborting seed.');
        }
        console.log('Users seeded successfully with hashed passwords.');

        // === TẠO UNIVERSITIES ===
        console.log('Seeding Universities...');
        const universitiesData = [
            { name: 'Đại học Bách Khoa Hà Nội', code: 'BKA', address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', website: 'https://hust.edu.vn', logoUrl: 'https://hust.edu.vn/uploads/logo-dhbk-1_1698408291.png', createdBy: adminUser._id },
            { name: 'Đại học Kinh tế Quốc dân', code: 'KHA', address: '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', website: 'https://neu.edu.vn', logoUrl: 'https://neu.edu.vn/Resources/Images/Subdomain/logo@2x.png', createdBy: adminUser._id },
            { name: 'Trường Đại học Ngoại thương', code: 'NTH', address: '91 Chùa Láng, Đống Đa, Hà Nội', website: 'https://ftu.edu.vn', logoUrl: 'https://www.ftu.edu.vn/wp-content/uploads/2020/08/LOGO%20FTU%20JPEG.jpg', createdBy: adminUser._id },
            { name: 'Học viện Công nghệ Bưu chính Viễn thông', code: 'PTIT', address: 'Km10 Nguyễn Trãi, Hà Đông, Hà Nội', website: 'https://ptit.edu.vn', logoUrl: 'https://portal.ptit.edu.vn/wp-content/uploads/2016/03/logo-PTIT-Vietnamese-Updated_01.png', createdBy: adminUser._id },
            { name: 'Đại học Quốc gia TP.HCM - Trường ĐH Bách Khoa', code: 'QSB', address: '268 Lý Thường Kiệt, Quận 10, TP.HCM', website: 'https://hcmut.edu.vn', createdBy: adminUser._id },
        ];
        const universities = await University.insertMany(universitiesData);
        console.log('Universities seeded.');
        const uniMap = {};
        universities.forEach(uni => { uniMap[uni.code] = uni._id; });
        const bka = universities.find(u => u.code === 'BKA'); // Dùng cho application
        const kha = universities.find(u => u.code === 'KHA'); // Dùng cho application
        const ptit = universities.find(u => u.code === 'PTIT'); // Dùng cho application


        // === TẠO MAJORS ===
        console.log('Seeding Majors...');
        const majorsData = [
            { name: 'Khoa học Máy tính', code: 'IT1', university: uniMap['BKA'], admissionQuota: 300, createdBy: adminUser._id },
            { name: 'Kỹ thuật Máy tính', code: 'IT2', university: uniMap['BKA'], admissionQuota: 200, createdBy: adminUser._id },
            { name: 'Quản trị Kinh doanh', code: 'QTKD1', university: uniMap['KHA'], admissionQuota: 400, createdBy: adminUser._id },
            { name: 'Marketing', code: 'MK1', university: uniMap['KHA'], admissionQuota: 250, createdBy: adminUser._id },
            { name: 'Kinh tế Đối ngoại', code: 'KTDN', university: uniMap['NTH'], admissionQuota: 500, createdBy: adminUser._id },
            { name: 'Công nghệ Thông tin (PTIT)', code: 'IT-PTIT', university: uniMap['PTIT'], admissionQuota: 350, createdBy: adminUser._id },
        ];
        const majors = await Major.insertMany(majorsData);
        console.log('Majors seeded.');
        const majorMap = {};
        majors.forEach(m => { majorMap[`${m.university.toString()}-${m.code}`] = m._id; });
        // Lấy ID các ngành để tạo application
        const it1_bka = majors.find(m => m.code === 'IT1' && m.university.equals(bka._id));
        const qtkd_kha = majors.find(m => m.code === 'QTKD1' && m.university.equals(kha._id));
        const it_ptit = majors.find(m => m.code === 'IT-PTIT' && m.university.equals(ptit._id));


        // === TẠO ADMISSION METHODS ===
        console.log('Seeding Admission Methods...');
        const admissionMethodsData = [
            { name: 'Xét tuyển theo kết quả thi Tốt nghiệp THPT', code: 'THPTQG', createdBy: adminUser._id },
            { name: 'Xét tuyển học bạ THPT', code: 'HOCBA', createdBy: adminUser._id },
            { name: 'Xét tuyển theo kết quả thi Đánh giá năng lực ĐHQGHN', code: 'DGNL_HNU', createdBy: adminUser._id },
        ];
        const admissionMethods = await AdmissionMethod.insertMany(admissionMethodsData);
        console.log('Admission Methods seeded.');
        const methodMap = {};
        admissionMethods.forEach(m => { methodMap[m.code] = m._id; });
        // Lấy ID các phương thức để tạo application
        const methodTHPT = admissionMethods.find(m => m.code === 'THPTQG');
        const methodHocBa = admissionMethods.find(m => m.code === 'HOCBA');
        const methodDGNL = admissionMethods.find(m => m.code === 'DGNL_HNU');


        // === TẠO SUBJECT GROUPS ===
        console.log('Seeding Subject Groups...');
        const subjectGroupsData = [
            { code: 'A00', name: 'Toán, Vật lý, Hóa học', subjects: ['Toán', 'Vật lý', 'Hóa học'], createdBy: adminUser._id },
            { code: 'A01', name: 'Toán, Vật lý, Tiếng Anh', subjects: ['Toán', 'Vật lý', 'Tiếng Anh'], createdBy: adminUser._id },
            { code: 'D01', name: 'Toán, Ngữ văn, Tiếng Anh', subjects: ['Toán', 'Ngữ văn', 'Tiếng Anh'], createdBy: adminUser._id },
        ];
        const subjectGroups = await SubjectGroup.insertMany(subjectGroupsData);
        console.log('Subject Groups seeded.');
        const groupMap = {};
        subjectGroups.forEach(g => { groupMap[g.code] = g._id; });
        // Lấy ID các tổ hợp để tạo application
        const groupA00 = subjectGroups.find(g => g.code === 'A00');


        // === TẠO MAJOR ADMISSION SUBJECT GROUPS ===
        console.log('Seeding Major Admission Subject Groups...');
        await MajorAdmissionSubjectGroup.insertMany([
            { major: it1_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, minScoreRequired: 27.5, createdBy: adminUser._id },
            { major: it1_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupMap['A01'], year: currentYear, minScoreRequired: 27.0, createdBy: adminUser._id },
            { major: it1_bka._id, admissionMethod: methodDGNL._id, year: currentYear, minScoreRequired: 90, createdBy: adminUser._id },
            { major: qtkd_kha._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, minScoreRequired: 26.0, createdBy: adminUser._id },
            { major: qtkd_kha._id, admissionMethod: methodTHPT._id, subjectGroup: groupMap['D01'], year: currentYear, minScoreRequired: 26.5, createdBy: adminUser._id },
            { major: qtkd_kha._id, admissionMethod: methodHocBa._id, year: currentYear, minScoreRequired: 27.5, createdBy: adminUser._id },
            { major: it_ptit._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: nextYear, createdBy: adminUser._id },
        ]);
        console.log('Major Admission Subject Groups seeded.');

        // === TẠO CANDIDATE PROFILES ===
        console.log('Seeding Candidate Profiles...');
        const profile1Data = {
            user: candidate1._id, fullName: 'Nguyễn Văn An', dob: new Date('2005-08-15'), gender: 'male', 
            idNumber: '001205001111', idIssueDate: new Date('2020-08-15'), idIssuePlace: 'CA Hà Nội', 
            ethnic: 'Kinh', nationality: 'Việt Nam', 
            permanentAddress: 'Số 123, Đường Thanh Niên, Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội', // Đảm bảo có giá trị
            contactAddress: 'Số 123, Đường Thanh Niên, Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội',
            phoneNumber: '0912345671', email: candidate1.email, 
            priorityArea: 'KV3', 
            highSchoolName: 'THPT Chuyên Hà Nội - Amsterdam', graduationYear: currentYear -1, 
            gpa10: 8.5, gpa11: 8.8, gpa12: 9.0, 
            conduct10: 'Tốt', conduct11: 'Tốt', conduct12: 'Tốt'
        };
        const profile1 = await CandidateProfile.create(profile1Data);

        const profile2Data = {
            user: candidate2._id, fullName: 'Trần Thị Bình', dob: new Date('2006-01-20'), gender: 'female', 
            idNumber: '001206002222', idIssueDate: new Date('2021-01-20'), idIssuePlace: 'CA TP.HCM', 
            ethnic: 'Kinh', nationality: 'Việt Nam', 
            permanentAddress: 'Số 456, Đường Cách Mạng Tháng Tám, Phường 10, Quận 3, Thành phố Hồ Chí Minh', // Đảm bảo có giá trị
            phoneNumber: '0987654322', email: candidate2.email, 
            priorityArea: 'KV1', priorityObjects: ['UT1'], 
            highSchoolName: 'THPT Chuyên Lê Hồng Phong, TP.HCM', graduationYear: currentYear -1, 
            gpa10: 9.0, gpa11: 9.2, gpa12: 9.5, 
            conduct10: 'Tốt', conduct11: 'Tốt', conduct12: 'Tốt'
        };
        const profile2 = await CandidateProfile.create(profile2Data);
        console.log('Candidate Profiles seeded.');

        // === TẠO DOCUMENT PROOFS (Mẫu) ===
        console.log('Seeding Document Proofs...');
        const doc1_c1 = await DocumentProof.create({ user: candidate1._id, originalName: 'An_HocBa.pdf', fileName: `doc-c1-hb-${Date.now()}.pdf`, filePath: `${config.uploadDir}/doc-c1-hb-${Date.now()}.pdf`, fileType: 'application/pdf', fileSize: 1024*500, documentType: 'hoc_ba' });
        const doc2_c1 = await DocumentProof.create({ user: candidate1._id, originalName: 'An_CCCD.jpg', fileName: `doc-c1-cccd-${Date.now()}.jpg`, filePath: `${config.uploadDir}/doc-c1-cccd-${Date.now()}.jpg`, fileType: 'image/jpeg', fileSize: 1024*200, documentType: 'cccd' });
        const doc1_c2 = await DocumentProof.create({ user: candidate2._id, originalName: 'Binh_HocBa.pdf', fileName: `doc-c2-hb-${Date.now()}.pdf`, filePath: `${config.uploadDir}/doc-c2-hb-${Date.now()}.pdf`, fileType: 'application/pdf', fileSize: 1024*600, documentType: 'hoc_ba' });
        console.log('Document Proofs seeded.');

        // === TẠO APPLICATIONS ===
        console.log('Seeding Applications...');
        const app1 = await Application.create({
            candidate: candidate1._id,
            candidateProfileSnapshot: { fullName: profile1.fullName, dob: profile1.dob, idNumber: profile1.idNumber, gpa12: profile1.gpa12, phoneNumber: profile1.phoneNumber, email: profile1.email, permanentAddress: profile1.permanentAddress },
            university: bka._id, major: it1_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear,
            examScores: { 'Toán': 8.75, 'Vật lý': 8.5, 'Hóa học': 8.0 },
            documents: [doc1_c1._id, doc2_c1._id],
            status: 'pending'
        });
        const app2 = await Application.create({
            candidate: candidate2._id,
            candidateProfileSnapshot: { fullName: profile2.fullName, dob: profile2.dob, idNumber: profile2.idNumber, gpa12: profile2.gpa12, phoneNumber: profile2.phoneNumber, email: profile2.email, permanentAddress: profile2.permanentAddress },
            university: kha._id, major: qtkd_kha._id, admissionMethod: methodHocBa._id, year: currentYear, 
            documents: [doc1_c2._id],
            status: 'approved', adminNotes: 'Hồ sơ hợp lệ, đủ điều kiện.', lastProcessedBy: adminUser._id, processedAt: new Date()
        });
         const app3 = await Application.create({
            candidate: candidate1._id, 
            candidateProfileSnapshot: { fullName: profile1.fullName, dob: profile1.dob, idNumber: profile1.idNumber, gpa12: profile1.gpa12, phoneNumber: profile1.phoneNumber, email: profile1.email, permanentAddress: profile1.permanentAddress },
            university: ptit._id, major: it_ptit._id, admissionMethod: methodDGNL._id, year: currentYear,
            examScores: { 'Điểm ĐGNL': 95 }, 
            status: 'rejected', adminNotes: 'Không đạt điểm sàn ĐGNL.', lastProcessedBy: adminUser._id, processedAt: new Date()
        });
        console.log('Applications seeded.');

        // === TẠO NOTIFICATIONS ===
        console.log('Seeding Notifications...');
        await Notification.insertMany([
            { user: candidate1._id, title: 'Nộp hồ sơ thành công!', message: `Hồ sơ ${app1._id} vào ngành Khoa học Máy tính - Đại học Bách Khoa Hà Nội đã được nộp.`, type: 'application_submitted', link: `/candidate/applications/${app1._id}`, relatedApplication: app1._id },
            { user: candidate2._id, title: 'Nộp hồ sơ thành công!', message: `Hồ sơ ${app2._id} vào ngành Quản trị Kinh doanh - Đại học Kinh tế Quốc dân đã được nộp.`, type: 'application_submitted', link: `/candidate/applications/${app2._id}`, relatedApplication: app2._id },
            { user: candidate2._id, title: 'Hồ sơ được duyệt!', message: `Chúc mừng! Hồ sơ ${app2._id} của bạn đã được duyệt.`, type: 'status_changed', link: `/candidate/applications/${app2._id}`, relatedApplication: app2._id },
            { user: candidate1._id, title: 'Nộp hồ sơ thành công!', message: `Hồ sơ ${app3._id} vào ngành Công nghệ Thông tin (PTIT) - Học viện Bưu chính Viễn thông đã được nộp.`, type: 'application_submitted', link: `/candidate/applications/${app3._id}`, relatedApplication: app3._id },
            { user: candidate1._id, title: 'Hồ sơ bị từ chối', message: `Rất tiếc, hồ sơ ${app3._id} của bạn đã bị từ chối. Ghi chú: Không đạt điểm sàn ĐGNL.`, type: 'status_changed', link: `/candidate/applications/${app3._id}`, relatedApplication: app3._id },
        ]);
        console.log('Notifications seeded.');


        console.log('\n================================================================');
        console.log(' EXTENSIVE DATA SEEDING COMPLETED SUCCESSFULLY! ');
        console.log('================================================================\n');
        console.log('Tài khoản Admin mẫu: admin@example.com / adminPassword123');
        console.log('----------------------------------------');
        console.log('Tài khoản Thí sinh mẫu:');
        console.log(`  Email: candidate1@example.com | Password: candidatePassword1`);
        console.log(`  Email: candidate2@example.com | Password: candidatePassword2`);
        console.log(`  Email: candidate3@example.com | Password: candidatePassword3`);
        console.log('================================================================\n');

    } catch (error) {
        console.error('Error seeding detailed data:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB Disconnected after detailed seeding.');
    }
};

seedData();

