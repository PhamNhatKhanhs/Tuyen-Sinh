# Hệ thống Quản lý Tuyển sinh Đại học

## 👥 Team Members

| Member | Role | Email | GitHub | Contribution |
|--------|------|-------|--------|--------------|
| **Phạm Nhật Khánh** | Backend Lead | khanh.backend.dev@gmail.com | [@PhamNhatKhanhs](https://github.com/PhamNhatKhanhs) | Backend APIs, Authentication, Database |
| **Hoàng Nguyễn Trà My** | Frontend Admin | my.frontend.admin@gmail.com | [@TraMyAdmin](https://github.com/TraMyAdmin) | Admin Dashboard, Management UI |
| **Nguyễn Thị Hạnh Nguyên** | Frontend User | nguyen.user.frontend@gmail.com | [@HanhNguyenUser](https://github.com/HanhNguyenUser) | User Interface, Application Forms |

## 🗓️ Development Timeline

### Phase 1: Foundation (Week 1)
- **Khánh**: Set up backend structure, database models
- **My**: Initialize admin dashboard layout
- **Nguyên**: Create user interface wireframes

### Phase 2: Core Development (Week 2-3)
- **Khánh**: Authentication system, API endpoints
- **My**: Admin management features, statistics
- **Nguyên**: User registration, application forms

### Phase 3: Integration & Polish (Week 4)
- **Khánh**: Email services, bug fixes
- **My**: UI improvements, data visualization
- **Nguyên**: Form validation, file uploads

## ⚡ Quick Stats
- **Total Commits**: 63
- **Development Time**: 4 weeks
- **Branches**: 3 feature branches + main
- **Technologies**: Node.js, React, MongoDB, TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/PhamNhatKhanhs/Tuyen-Sinh.git
cd Tuyen-Sinh

# Install backend dependencies
cd backend-app
npm install

# Install frontend dependencies  
cd ../frontend-app
npm install
```

### Running the Application
```bash
# Terminal 1: Start backend (Khánh's work)
cd backend-app
npm run dev

# Terminal 2: Start frontend (My & Nguyên's work)
cd frontend-app
npm run dev
```

## 🏗️ Architecture

### Backend (Khánh)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Email**: Nodemailer integration
- **Structure**: MVC pattern with middleware

### Frontend Admin (My) 
- **Framework**: React with hooks
- **UI Library**: Ant Design / Material-UI
- **State**: Redux Toolkit
- **Features**: Dashboard, user management, statistics

### Frontend User (Nguyên)
- **Framework**: React with TypeScript
- **Forms**: React Hook Form + Yup validation
- **Upload**: File handling with progress
- **UX**: Responsive design, accessibility

## 📈 Commit Statistics

### By Author:
- **Khánh**: 25 commits (39.7%) - Backend focus
- **My**: 20 commits (31.7%) - Admin UI focus  
- **Nguyên**: 18 commits (28.6%) - User UI focus

### By Type:
- **feat**: 29 commits (46%) - New features
- **fix**: 12 commits (19%) - Bug fixes
- **style**: 14 commits (22%) - UI improvements
- **enhance**: 8 commits (13%) - Enhancements

## 🔗 Related Links
- [Live Demo](https://tuyen-sinh-demo.vercel.app)
- [API Documentation](https://api-docs.tuyen-sinh.com)
- [Design System](https://design.tuyen-sinh.com)

---
*Built with ❤️ by Team TuyenSinh - University Admission Management System*
