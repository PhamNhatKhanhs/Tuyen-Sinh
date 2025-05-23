const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file từ thư mục gốc của backend-app
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models (Điều chỉnh đường dẫn nếu cần)
const User = require('../src/models/User');
const University = require('../src/models/University');
const Major = require('../src/models/Major');
const AdmissionMethod = require('../src/models/AdmissionMethod');
const SubjectGroup = require('../src/models/SubjectGroup');
const MajorAdmissionSubjectGroup = require('../src/models/MajorAdmissionSubjectGroup');
// const CandidateProfile = require('../src/models/CandidateProfile'); // Bỏ comment nếu muốn seed cả profile
// const Application = require('../src/models/Application'); // Bỏ comment nếu muốn seed cả application

const connectDB = require('../src/config/db'); // Sử dụng hàm kết nối từ config

const currentYear = new Date().getFullYear();

const seedData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for seeding...');

        // Xóa dữ liệu cũ
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await University.deleteMany({});
        await Major.deleteMany({});
        await AdmissionMethod.deleteMany({});
        await SubjectGroup.deleteMany({});
        await MajorAdmissionSubjectGroup.deleteMany({});
        // await CandidateProfile.deleteMany({});
        // await Application.deleteMany({});
        console.log('Data cleared.');

        // === TẠO USERS ===
        console.log('Seeding Users...');
        const users = await User.create([
            { email: 'admin@example.com', password: 'adminPassword123', role: 'admin', fullName: 'Quản Trị Viên Hệ Thống' },
            { email: 'candidate1@example.com', password: 'candidatePassword1', role: 'candidate', fullName: 'Nguyễn Văn Thí Sinh A' },
            { email: 'candidate2@example.com', password: 'candidatePassword2', role: 'candidate', fullName: 'Trần Thị Thí Sinh B' },
        ]);
        const adminUser = users.find(u => u.role === 'admin');
        console.log('Users seeded.');

        // === TẠO UNIVERSITIES ===
        console.log('Seeding Universities...');
        const universities = await University.insertMany([
            { name: 'Đại học Bách Khoa Hà Nội', code: 'BKA', address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', website: 'https://hust.edu.vn', logoUrl: 'https://hust.edu.vn/uploads/logo-dhbk-1_1698408291.png', description: 'Trường đại học kỹ thuật hàng đầu Việt Nam.', createdBy: adminUser._id },
            { name: 'Đại học Kinh tế Quốc dân', code: 'KHA', address: '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội', website: 'https://neu.edu.vn', logoUrl: 'https://neu.edu.vn/Resources/Images/Subdomain/logo@2x.png', description: 'Trường đại học hàng đầu về kinh tế và quản lý.', createdBy: adminUser._id },
            { name: 'Trường Đại học Ngoại thương', code: 'NTH', address: '91 Chùa Láng, Đống Đa, Hà Nội', website: 'https://ftu.edu.vn', logoUrl: 'https://www.ftu.edu.vn/wp-content/uploads/2020/08/LOGO%20FTU%20JPEG.jpg', description: 'Đào tạo chuyên sâu về kinh tế đối ngoại và thương mại quốc tế.', createdBy: adminUser._id },
            { name: 'Học viện Công nghệ Bưu chính Viễn thông', code: 'PTIT', address: 'Km10 Nguyễn Trãi, Hà Đông, Hà Nội', website: 'https://ptit.edu.vn', logoUrl: 'https://portal.ptit.edu.vn/wp-content/uploads/2016/03/logo-PTIT-Vietnamese-Updated_01.png', description: 'Đào tạo đa ngành về Công nghệ thông tin và Truyền thông.', createdBy: adminUser._id }
        ]);
        console.log('Universities seeded.');
        const bka = universities.find(u => u.code === 'BKA');
        const kha = universities.find(u => u.code === 'KHA');
        const nth = universities.find(u => u.code === 'NTH');
        const ptit = universities.find(u => u.code === 'PTIT');


        // === TẠO MAJORS ===
        console.log('Seeding Majors...');
        const majors = await Major.insertMany([
            // BKA
            { name: 'Công nghệ Thông tin (Việt-Nhật)', code: 'IT-E6', university: bka._id, admissionQuota: 120, createdBy: adminUser._id },
            { name: 'Khoa học Máy tính', code: 'IT1', university: bka._id, admissionQuota: 300, createdBy: adminUser._id },
            { name: 'Kỹ thuật Máy tính', code: 'IT2', university: bka._id, admissionQuota: 200, createdBy: adminUser._id },
            { name: 'An toàn không gian số (Cyber Security)', code: 'IT-E15', university: bka._id, admissionQuota: 60, createdBy: adminUser._id },
            // KHA
            { name: 'Quản trị Kinh doanh', code: 'QTKD', university: kha._id, admissionQuota: 400, createdBy: adminUser._id },
            { name: 'Kế toán', code: 'KT', university: kha._id, admissionQuota: 350, createdBy: adminUser._id },
            { name: 'Tài chính - Ngân hàng', code: 'TCNH', university: kha._id, admissionQuota: 300, createdBy: adminUser._id },
            // NTH
            { name: 'Kinh tế Đối ngoại', code: 'KTDN', university: nth._id, admissionQuota: 500, createdBy: adminUser._id },
            { name: 'Quản trị kinh doanh quốc tế', code: 'QTKDQT', university: nth._id, admissionQuota: 200, createdBy: adminUser._id },
            // PTIT
            { name: 'Công nghệ Thông tin (Định hướng AI)', code: 'PTIT-IT-AI', university: ptit._id, admissionQuota: 100, createdBy: adminUser._id },
            { name: 'An toàn Thông tin', code: 'PTIT-ATTT', university: ptit._id, admissionQuota: 150, createdBy: adminUser._id },
            { name: 'Marketing Số', code: 'PTIT-DM', university: ptit._id, admissionQuota: 80, createdBy: adminUser._id },
        ]);
        console.log('Majors seeded.');
        const it1_bka = majors.find(m => m.code === 'IT1' && m.university.equals(bka._id));
        const it2_bka = majors.find(m => m.code === 'IT2' && m.university.equals(bka._id));
        const qtkd_kha = majors.find(m => m.code === 'QTKD' && m.university.equals(kha._id));
        const ktdn_nth = majors.find(m => m.code === 'KTDN' && m.university.equals(nth._id));
        const it_ai_ptit = majors.find(m => m.code === 'PTIT-IT-AI' && m.university.equals(ptit._id));

        // === TẠO ADMISSION METHODS ===
        console.log('Seeding Admission Methods...');
        const admissionMethods = await AdmissionMethod.insertMany([
            { name: 'Xét tuyển theo kết quả thi THPT', code: 'THPT', description: 'Sử dụng điểm thi tốt nghiệp THPT.', createdBy: adminUser._id },
            { name: 'Xét tuyển học bạ THPT', code: 'HOCBA', description: 'Sử dụng kết quả học tập bậc THPT.', createdBy: adminUser._id },
            { name: 'Tuyển thẳng theo quy định của Bộ GD&ĐT', code: 'TUYENTHANG_BGD', description: 'Theo các tiêu chí tuyển thẳng của Bộ.', createdBy: adminUser._id },
            { name: 'Xét tuyển kết hợp (Chứng chỉ quốc tế, phỏng vấn)', code: 'KET HOP', description: 'Kết hợp nhiều tiêu chí.', createdBy: adminUser._id },
            { name: 'Xét tuyển theo kết quả thi ĐGNL', code: 'DGNL', description: 'Sử dụng điểm thi Đánh giá năng lực của ĐHQG.', createdBy: adminUser._id },
        ]);
        console.log('Admission Methods seeded.');
        const methodTHPT = admissionMethods.find(m => m.code === 'THPT');
        const methodHocBa = admissionMethods.find(m => m.code === 'HOCBA');
        const methodDGNL = admissionMethods.find(m => m.code === 'DGNL');

        // === TẠO SUBJECT GROUPS ===
        console.log('Seeding Subject Groups...');
        const subjectGroups = await SubjectGroup.insertMany([
            { code: 'A00', name: 'Toán, Vật lý, Hóa học', subjects: ['Toán', 'Vật lý', 'Hóa học'], createdBy: adminUser._id },
            { code: 'A01', name: 'Toán, Vật lý, Tiếng Anh', subjects: ['Toán', 'Vật lý', 'Tiếng Anh'], createdBy: adminUser._id },
            { code: 'B00', name: 'Toán, Hóa học, Sinh học', subjects: ['Toán', 'Hóa học', 'Sinh học'], createdBy: adminUser._id },
            { code: 'D01', name: 'Toán, Ngữ văn, Tiếng Anh', subjects: ['Toán', 'Ngữ văn', 'Tiếng Anh'], createdBy: adminUser._id },
            { code: 'D07', name: 'Toán, Hóa học, Tiếng Anh', subjects: ['Toán', 'Hóa học', 'Tiếng Anh'], createdBy: adminUser._id },
        ]);
        console.log('Subject Groups seeded.');
        const groupA00 = subjectGroups.find(g => g.code === 'A00');
        const groupA01 = subjectGroups.find(g => g.code === 'A01');
        const groupD01 = subjectGroups.find(g => g.code === 'D01');

        // === TẠO MAJOR ADMISSION SUBJECT GROUPS ===
        console.log('Seeding Major Admission Subject Groups...');
        await MajorAdmissionSubjectGroup.insertMany([
            // BKA IT1 - THPT - A00, A01
            { major: it1_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, createdBy: adminUser._id },
            { major: it1_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupA01._id, year: currentYear, createdBy: adminUser._id },
            // BKA IT2 - THPT - A00
            { major: it2_bka._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, createdBy: adminUser._id },
            // KHA QTKD - THPT - A00, D01
            { major: qtkd_kha._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, createdBy: adminUser._id },
            { major: qtkd_kha._id, admissionMethod: methodTHPT._id, subjectGroup: groupD01._id, year: currentYear, createdBy: adminUser._id },
            // NTH KTDN - THPT - A00, D01
            { major: ktdn_nth._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, createdBy: adminUser._id },
            { major: ktdn_nth._id, admissionMethod: methodTHPT._id, subjectGroup: groupD01._id, year: currentYear, createdBy: adminUser._id },
             // PTIT IT-AI - THPT - A00, A01
            { major: it_ai_ptit._id, admissionMethod: methodTHPT._id, subjectGroup: groupA00._id, year: currentYear, createdBy: adminUser._id },
            { major: it_ai_ptit._id, admissionMethod: methodTHPT._id, subjectGroup: groupA01._id, year: currentYear, createdBy: adminUser._id },
             // PTIT IT-AI - DGNL (không cần tổ hợp)
            { major: it_ai_ptit._id, admissionMethod: methodDGNL._id, year: currentYear, createdBy: adminUser._id }, // subjectGroup là optional
        ]);
        console.log('Major Admission Subject Groups seeded.');

        console.log('========================================');
        console.log('DATA SEEDING COMPLETED SUCCESSFULLY!');
        console.log('========================================');
        console.log('Tài khoản Admin mẫu:');
        console.log(`  Email: admin@example.com`);
        console.log(`  Password: adminPassword123`);
        console.log('----------------------------------------');
        console.log('Tài khoản Thí sinh mẫu:');
        console.log(`  Email: candidate1@example.com | Password: candidatePassword1`);
        console.log(`  Email: candidate2@example.com | Password: candidatePassword2`);
        console.log('========================================');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB Disconnected.');
    }
};

seedData();
